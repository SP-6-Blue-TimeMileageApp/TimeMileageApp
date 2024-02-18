import { Tabs } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Alert } from "react-native";

export default () => {
    return (
        <Tabs>
            <Tabs.Screen name="homePage" options={{ 
                tabBarActiveBackgroundColor: "#D9D9D9", 
                headerTitle: '', 
                title: 'Home',
                headerRight: () => (
                    <Feather onPress={() => Alert.alert('Settings')} name="settings" size={24} color="black" />
                ),
                tabBarIcon: () => (
                    <FontAwesome name="map-marker" size={24} color="black" />
                )
            }} />
            
            
            <Tabs.Screen name="historyPage" options={{ 
                tabBarActiveBackgroundColor: "#D9D9D9", 
                title: 'History',
                headerRight: () => (
                    <Feather onPress={() => Alert.alert('Settings')} name="settings" size={24} color="black" />
                ),
                tabBarIcon: () => (
                    <FontAwesome name="history" size={24} color="black" />
                )
            }} />
            
            
            <Tabs.Screen name="settingsPage" options={{ 
                tabBarActiveBackgroundColor: "#D9D9D9", 
                title: 'Settings',  
                headerRight: () => (
                    <Feather onPress={() => Alert.alert('Settings')} name="settings" size={24} color="black" />
                ),
                tabBarIcon: () => (
                    <Feather name="settings" size={24} color="black" />
                )
            }} />
        </Tabs>
        
    );
}


