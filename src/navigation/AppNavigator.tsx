import React, { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { colors } from '../theme/colors';
import BottomNavBar from '../components/BottomNavBar';
import Home from '../app/(tabs)/home';
import Bookmarks from '../app/(tabs)/bookmarks';
import Profile from '../app/(tabs)/profile';

export type Route = {
  key: 'Home' | 'Bookmarks' | 'Profile';
  title: string;
};

export type NavigationObject = {
  navigate: (screenName: 'Home' | 'Bookmarks' | 'Profile') => void;
};

const renderScene = SceneMap({
  Home: Home,
  Bookmarks: Bookmarks,
  Profile: Profile,
});

const routes: Route[] = [
  { key: 'Home', title: 'Home' },
  { key: 'Bookmarks', title: 'Bookmarks' },
  { key: 'Profile', title: 'Profile' },
];

const AppNavigator = () => {
  const [index, setIndex] = useState(0);
  const layout = useWindowDimensions();

  const currentRoute = routes[index].key;

  const handleNavigation = (screenName: 'Home' | 'Bookmarks' | 'Profile') => {
    const routeIndex = routes.findIndex((r) => r.key === screenName);
    if (routeIndex !== -1) {
      setIndex(routeIndex);
    }
  };

  const navigation: NavigationObject = {
    navigate: handleNavigation,
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 24 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        swipeEnabled={true}
        removeClippedSubviews={true}
        renderTabBar={() => null}
      />
      <BottomNavBar navigation={navigation} active={currentRoute} />
    </View>
  );
};

export default AppNavigator;
