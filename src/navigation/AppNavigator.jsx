import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../theme/colors';
import BottomNavBar from '../components/BottomNavBar';
import Home from '../app/(tabs)/home';
import Bookmarks from '../app/(tabs)/bookmarks';
import Profile from '../app/(tabs)/profile';
import StoryDetail from '../app/story/[id]';
import ChapterDetail from '../app/story/chapter/[id]';

const Stack = createStackNavigator();

const TabRenderScene = SceneMap({
  Home,
  Bookmarks,
  Profile,
});

const routes = [
  { key: 'Home', title: 'Home' },
  { key: 'Bookmarks', title: 'Bookmarks' },
  { key: 'Profile', title: 'Profile' },
];

const TabNavigator = () => {
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  const currentRoute = routes[index].key;

  const handleNavigation = (screenName) => {
    const routeIndex = routes.findIndex((r) => r.key === screenName);
    if (routeIndex !== -1) {
      setIndex(routeIndex);
    }
  };

  const navigation = {
    navigate: handleNavigation,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={TabRenderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={false}
        removeClippedSubviews={true}
        renderTabBar={() => null}
      />
      <BottomNavBar navigation={navigation} active={currentRoute} />
    </View>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="StoryDetail" component={StoryDetail} />
      <Stack.Screen name="ChapterDetail" component={ChapterDetail} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
