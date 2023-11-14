package com.example.myapplication;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.lorentzos.flingswipe.SwipeFlingAdapterView;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private ImageAdapter imageAdapter;
    List<Integer> imageResIds;
    SwipeFlingAdapterView flingAdapterView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        flingAdapterView = findViewById(R.id.swipe);

        imageResIds = new ArrayList<>();
        for (int i = 1; i <= 5; i++) {
            String imageName = "timage" + i;
            int resourceId = getResources().getIdentifier(imageName, "drawable", getPackageName());
            imageResIds.add(resourceId);
        }

        imageAdapter = new ImageAdapter(this, imageResIds);
        flingAdapterView.setAdapter(imageAdapter);

        flingAdapterView.setFlingListener(new SwipeFlingAdapterView.onFlingListener() {
            @Override
            public void removeFirstObjectInAdapter() {
                imageResIds.remove(0);
                imageAdapter.notifyDataSetChanged();
            }

            @Override
            public void onLeftCardExit(Object o) {
                Toast.makeText(MainActivity.this, "dislike", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onRightCardExit(Object o) {
                Toast.makeText(MainActivity.this, "like", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onAdapterAboutToEmpty(int i) {
               
            }

            @Override
            public void onScroll(float v) {
                
            }
        });

        flingAdapterView.setOnItemClickListener(new SwipeFlingAdapterView.OnItemClickListener() {
            @Override
            public void onItemClicked(int i, Object o) {
                Toast.makeText(MainActivity.this, "Image clicked: timage" + (i + 1), Toast.LENGTH_SHORT).show();
            }
        });

        Button like, dislike, extraButton;

        like=findViewById(R.id.like);
        dislike=findViewById(R.id.dislike);
        extraButton = findViewById(R.id.extraButton);

        extraButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(MainActivity.this, AddSongActivity.class);
                startActivity(intent);
            }
        });

        like.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                flingAdapterView.getTopCardListener().selectRight();
            }
        });

        dislike.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View view) {
                flingAdapterView.getTopCardListener().selectLeft();
            }
        });
    }

    
    private class ImageAdapter extends BaseAdapter {

        private Context context;
        private List<Integer> imageResIds;

        public ImageAdapter(Context context, List<Integer> imageResIds) {
            this.context = context;
            this.imageResIds = imageResIds;
        }

        @Override
        public int getCount() {
            return imageResIds.size();
        }

        @Override
        public Object getItem(int position) {
            return imageResIds.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            ImageView imageView;

            if (convertView == null) {
                
                LayoutInflater inflater = LayoutInflater.from(context);
                imageView = (ImageView) inflater.inflate(R.layout.item, parent, false)
                        .findViewById(R.id.image);
            } else {
                
                imageView = (ImageView) convertView;
            }

            
            imageView.setImageResource(imageResIds.get(position));

            return imageView;
        }
    }
}
