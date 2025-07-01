import { router, Tabs } from 'expo-router';
import React from 'react';
import { Platform,Text,View, } from 'react-native';

import UtilisateurService from '@/services/userService';
import Ionicons from '@expo/vector-icons/Ionicons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NavigationContainer } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: 'white',
      tabBarStyle: {
        backgroundColor: '#095E09',
        height: 70,
        paddingBottom: 10,
      },

      //le topbar
      headerStyle: {
        backgroundColor: '#095E09',
      },
      headerRight: () => (
        <View style={{
          marginRight: 15,
          borderRadius: 20,
          padding: 6,
        }}>
          {/* //deconection de l'application , suppression du token et rediretion vers le login */}
        <TouchableOpacity
         onPress={async () => {
          try {
            const { status, message } = await UtilisateurService.logoutUser();
            console.log('Déconnexion réussie :', message);
            await AsyncStorage.removeItem('auth_token'); // Supprime le token
            router.push('/loginScreen'); // Redirige vers l'écran de login
          } catch (error) {
            console.error('Erreur de déconnexion :', error);
          }
        }}
        >
          <Ionicons name="log-out-outline" size={30} color="white" />
        </TouchableOpacity>

        </View>
      ),
      headerLeft: () => (
        <View style={{
          marginRight: 15,
          borderRadius: 20,
          padding: 6,
        }}>
        </View>
      ),
      headerShadowVisible: false,
      headerTintColor: 'white',

    
    }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="gestion"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "menu": "menu"} color={color} size={30}/>
          ),
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person-circle": "person-circle-outline"} color={color} size={30}/>
          ),

        }}
      />
    </Tabs>

  
  );
}
