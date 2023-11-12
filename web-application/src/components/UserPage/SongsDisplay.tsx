import React from 'react';
import LikedSongsComponent from './LikedSongsComponent';
import PostedSongsComponent from './PostedSongsComponent';
import { LikeOutlined, SelectOutlined} from '@ant-design/icons';
import { Tabs } from 'antd';

const SongsDisplay: React.FC = () => {
  return (
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          label: (
            <span>
              <LikeOutlined />
              Liked
            </span>
          ),
          key: '1',
          children: <LikedSongsComponent />,
        },
        {
          label: (
            <span>
              <SelectOutlined />
              Posted
            </span>
          ),
          key: '2',
          children: <PostedSongsComponent />,
        },
      ]}
    />
  );
};
  
export default SongsDisplay;
    
    
    