import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../theme/colors';
import BottomNavBar from '../components/BottomNavBar';
import { TabNavigationProvider } from './tabContext';
import Home from '../app/(tabs)/home';
import Bookmarks from '../app/(tabs)/bookmarks';
import Profile from '../app/(tabs)/profile';
import StoryDetail from '../app/story/[id]';
import ChapterDetail from '../app/story/chapter/[id]';
import SettingsScreen from '../app/settings';

const Stack = createStackNavigator();

const TabRenderScene = SceneMap({
  Home,
  Bookmarks,
  Profile,
});

const routes = [
  { key: 'Home', title: 'Home', component: Home },
  { key: 'Bookmarks', title: 'Bookmarks', component: Bookmarks },
  { key: 'Profile', title: 'Profile', component: Profile },
];

const TabNavigator = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

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
    <TabNavigationProvider
      value={{
        active: currentRoute,
        navigateTab: handleNavigation,
      }}
    >
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
    </TabNavigationProvider>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="StoryDetail" component={StoryDetail} />
      <Stack.Screen name="ChapterDetail" component={ChapterDetail} />
      <Stack.Screen name="Setting" component={SettingsScreen} />
      <Stack.Screen name="Profile" component={Profile} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
