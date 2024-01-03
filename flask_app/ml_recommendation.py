#Interfile imports
from endpoints import get_all_song_info, display_followed_songs, get_user_group_songs
from endpoints import get_all_genre_preference, get_all_album_preference, get_all_performer_preference, user_followings_genre_prf, user_followings_album_prf, user_followings_performer_prf, group_genre_prf, group_album_prf, group_performer_prf, user_genre_prf, user_album_prf, user_performer_prf
from endpoints import get_all_song_info, display_followed_songs, get_user_group_songs

#Library Imports
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import random
from functools import reduce
from itertools import combinations

pd.options.mode.chained_assignment = None
keys = ["album", "performer", "genre", "song_id", "songs_name", "username"]

def get_recommendation_weights(user_preferences, target_preferences, criteria):    
    data_user = user_preferences
    df_user = pd.DataFrame.from_dict(data_user.get(criteria + 's'))
    
    data_target = target_preferences
    df_target = pd.DataFrame.from_dict(data_target.get(criteria + 's'))

    common_items = list(set(df_user[criteria]) & set(df_target[criteria]))

    df_user_common = df_user[df_user[criteria].isin(common_items)]
    df_all_common = df_target[df_target[criteria].isin(common_items)]

    # Content Filtering
    items_not_in_common = set(df_target[criteria]) - set(df_all_common[criteria])
    df_all_not_in_common = df_target[df_target[criteria].isin(items_not_in_common)]
    df_encoded = pd.get_dummies(df_all_not_in_common, columns=[criteria], drop_first=False)

    content_similarity_matrix = cosine_similarity(df_encoded)
    normalized_content_similarity_matrix = content_similarity_matrix / content_similarity_matrix.sum()

    items_with_weights_content = []
    for item_idx, item in enumerate(df_all_not_in_common[criteria]):
        weight = np.sum(normalized_content_similarity_matrix[:, item_idx])
        if weight > (np.sum(normalized_content_similarity_matrix) / len(normalized_content_similarity_matrix)):
            items_with_weights_content.append({criteria: item, 'normalized_weight_content': weight})

    df_items_weights_content = pd.DataFrame(items_with_weights_content)

    # Collaborative Filtering
    user_weights = df_user_common['count'].values
    target_weights = df_all_common['count'].values

    user_weights_normalized = user_weights / sum(user_weights)
    target_weights_normalized = target_weights / sum(target_weights)

    df_user_common_encoded = pd.get_dummies(df_user_common, columns=[criteria], drop_first=False)
    df_target_common_encoded = pd.get_dummies(df_all_common, columns=[criteria], drop_first=False)

    similarity_matrix = cosine_similarity(df_user_common_encoded.drop('count', axis=1), df_target_common_encoded.drop('count', axis=1), dense_output=False)
    weighted_similarity_matrix = similarity_matrix * user_weights_normalized[:, np.newaxis] * target_weights_normalized

    items_with_weights = []
    for item_idx, item in enumerate(df_all_common[criteria]):
        weight = np.sum(weighted_similarity_matrix[:, item_idx])
        items_with_weights.append({criteria: item, 'weight': weight})

    df_items_weights = pd.DataFrame(items_with_weights)

    normalized_weight_list = df_items_weights['weight'] / df_items_weights['weight'].sum()
    df_items_weights['normalized_weight_collaborative'] = normalized_weight_list

    df_items_weights_collaborative = df_items_weights.drop('weight', axis=1)

    df_items_weights_hybrid = pd.merge(df_items_weights_collaborative, df_items_weights_content, on=criteria, how='outer').fillna(value=0)

    col_ratio = len(df_items_weights_collaborative)
    con_ratio = len(df_items_weights_content)
    df_items_weights_hybrid['combined_weight'] = col_ratio * df_items_weights_hybrid['normalized_weight_collaborative'] + con_ratio * df_items_weights_hybrid['normalized_weight_content']
    df_items_weights_hybrid['normalized_combined_weight'] = df_items_weights_hybrid['combined_weight'] / df_items_weights_hybrid['combined_weight'].sum()

    return df_items_weights_hybrid

def recommend_songs_on_criteria(weights, x, filtered_list):
    unique_song_ids = set()
    common_songs = []

    for song in filtered_list:
        item = song[x]
        if not weights.loc[weights[x] == item].empty:
            song_id = song['song_id']
            if song_id not in unique_song_ids:
                common_songs.append(song)
                unique_song_ids.add(song_id)

    df_common_songs = pd.DataFrame(common_songs)

    proportions = weights[[x, 'normalized_combined_weight']]

    max_song_count = min(len(common_songs), 50)    
    initial_total = (proportions['normalized_combined_weight'] * max_song_count).astype(int).sum()     
    diff = max_song_count - initial_total

    proportions['song_count'] = (proportions['normalized_combined_weight'] * max_song_count).astype(int)
    while diff > 0:
        min_index = proportions['song_count'].idxmin()
        proportions.loc[min_index, 'song_count'] += 1
        diff -= 1   

    selected_songs = {}
    for index, row in proportions.iterrows():
        item_value = row[x]
        count = row['song_count']
        item_songs = df_common_songs[df_common_songs[x] == item_value]

        # To avoid going of the list value when count is more than in the list
        count = min(count, len(item_songs))

        selected_songs[item_value] = item_songs.sample(count, replace=False)

    recommended_songs_list = []
    
    for item, songs in selected_songs.items():
        item_songs_list = songs[keys].to_dict(orient='records')
        recommended_songs_list.extend(item_songs_list)

    return recommended_songs_list


def recommendation_parameters_to_weights(username , target_audience , criteria_list): 
    
    weights_list = []   
    
    if target_audience == 'all':
        target_preferences_genre = get_all_genre_preference().get_json()
        target_preferences_album = get_all_album_preference().get_json()
        target_preferences_performer = get_all_performer_preference().get_json()
        
    if target_audience == 'followings':
        target_preferences_genre = user_followings_genre_prf(username).get_json()
        target_preferences_album = user_followings_album_prf(username).get_json()
        target_preferences_performer = user_followings_performer_prf(username).get_json()
        
    if target_audience == 'group':
        target_preferences_genre = group_genre_prf(username).get_json()
        target_preferences_album = group_album_prf(username).get_json()
        target_preferences_performer = group_performer_prf(username).get_json()
        
    #else:
        #return jsonify({'error': 'target_audience can only be all/followings/group !'})

    user_genre_preferences = user_genre_prf(username).get_json()
    user_album_preferences = user_album_prf(username).get_json()
    user_performer_preferences = user_performer_prf(username).get_json()   
    
    
    for criteria in criteria_list:
        if criteria == 'genre':
            genre_weights = get_recommendation_weights(user_genre_preferences, target_preferences_genre, criteria)
            weights_list.append({'criteria': 'genre', 'weight': genre_weights})
            print(criteria)
        
        if criteria == 'album':
            album_weights = get_recommendation_weights(user_album_preferences, target_preferences_album, criteria)
            weights_list.append({'criteria': 'album', 'weight': album_weights})
            print(criteria)
        
        if criteria == 'performer':
            performer_weights = get_recommendation_weights(user_performer_preferences, target_preferences_performer, criteria)
            weights_list.append({'criteria': 'performer', 'weight': performer_weights})
            print(criteria)
            
                    
    return weights_list


def return_recommended_songs(username, weights_list, target_audience): 
       
    if target_audience == 'all':
        target_songs = get_all_song_info()
        
        
    if target_audience == 'followings':
        target_songs = display_followed_songs(username)
        
        
    if target_audience == 'group':
                  
        target_songs = get_user_group_songs(username)
        
    data_song = target_songs.get_json()
    df_user = pd.DataFrame.from_dict(data_song)

    songs_lists = df_user['songs'].explode().tolist() # This is due to a weird panda bug where even though it is of list format it, compiler does not understand it.

    filtered_list = []    
    non_na_songs_lists = [value for value in songs_lists if value == value]
    for song_lists in non_na_songs_lists:    
        for song in song_lists:
            filtered_data = {key: song_lists[key] for key in keys if key in song_lists}
            filtered_list.append(filtered_data)

    dataframes = []
    for dt in weights_list:
        recommended_songs_list = recommend_songs_on_criteria(dt['weight'], dt['criteria'], filtered_list)   
        df = pd.DataFrame(recommended_songs_list) 
        df.name = f"{dt['criteria']}_list"
        dataframes.append({'name': df.name, 'df': df})   
    

    
    df_objects = [dict['df'] for dict in dataframes]
    sum_of_all_songs_recommended = sum(df.shape[0] for df in df_objects)
    max_count = min(sum_of_all_songs_recommended, 50)
    final_counter = 0


    df_names = [dict['name'] for dict in dataframes]
    # Get all permutations of the df names except for the empty set
    all_combinations_names = [comb for i in reversed(range(len(df_names) + 1)) for comb in combinations(df_names, r=i) if len(comb) > 0]
    all_combinations_objects = [tuple(df_objects[df_names.index(name)] for name in combination) for combination in all_combinations_names]

    # Shuffling the combinations in between ranks

    final_recommended_songs = []
    for rank_comb_list in all_combinations_objects:
        # Shuffle to avoid non-deterministic values
        list_shuffle = list(rank_comb_list)  
        random.shuffle(list_shuffle)
        intersection = reduce(lambda left, right: pd.merge(left, right, on=keys, how='inner'), list_shuffle)
        if (intersection.shape[0] + final_counter) <= max_count:
            final_recommended_songs.extend(intersection.to_dict(orient='records'))
            final_counter += intersection.shape[0]
        else:
            remaining_count = max_count - final_counter
            final_recommended_songs.extend((intersection.head(remaining_count)).to_dict(orient='records'))
            final_counter += remaining_count
            break
    
    return final_recommended_songs
    





        
