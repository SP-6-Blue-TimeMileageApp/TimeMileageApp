import { Tabs } from "expo-router";
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Alert } from "react-native";
import { useRouter } from 'expo-router';

import { firebaseLogout} from '../../firebaseConfig';



export default () => {

    const router = useRouter();

    const logout = () => {

        while(router.canGoBack()) {
            router.back();
        }
        router.replace('basePage');

        firebaseLogout();
    }


    return (
        <Tabs>
            <Tabs.Screen name="homePage" options={{ 
                tabBarActiveBackgroundColor: "#D9D9D9", 
                headerTitle: '', 
                title: 'Home',
                headerRight: () => (
                    <Feather onPress={() => 
                        Alert.alert(
                            'Logout', 
                            'Are you sure you want to logout?', 
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'OK', onPress: (logout)}
                            ], 
                            {cancelable: false}
                        )
                    } name="log-out" size={24} color="black" />  
                ),
                tabBarIcon: () => (
                    <FontAwesome name="map-marker" size={24} color="black" />
                )
            }} />
            
            
            <Tabs.Screen name="historyPage" options={{ 
                tabBarActiveBackgroundColor: "#D9D9D9", 
                title: 'History',
                headerRight: () => (
                    <Feather onPress={() => 
                        Alert.alert(
                            'Logout', 
                            'Are you sure you want to logout?', 
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'OK', onPress: (logout)}
                            ], 
                            {cancelable: false}
                        )
                    } name="log-out" size={24} color="black" />  
                ),
                tabBarIcon: () => (
                    <FontAwesome name="history" size={24} color="black" />
                )
            }} />
            
            
            <Tabs.Screen name="settingsPage" options={{ 
                tabBarActiveBackgroundColor: "#D9D9D9", 
                title: 'Account Details',  
                headerRight: () => (
                    <Feather onPress={() => 
                        Alert.alert(
                            'Logout', 
                            'Are you sure you want to logout?', 
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'OK', onPress: (logout)}
                            ], 
                            {cancelable: false}
                        )
                    } name="log-out" size={24} color="black" />  
                ),
                tabBarIcon: () => (
                    <Feather name="user" size={24} color="black" />
                )
            }} />

            <Tabs.Screen name="subscriptionPay" options={{
                headerShown: true,
                title: '',
                href: null,
                headerRight: () => (
                    <Feather onPress={() => 
                        Alert.alert(
                            'Logout', 
                            'Are you sure you want to logout?', 
                            [
                                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                {text: 'OK', onPress: (logout)}
                            ], 
                            {cancelable: false}
                        )
                    } name="log-out" size={24} color="black" />  
                ),
                headerLeft: () => (
                    <Feather onPress={() => router.replace('./settingsPage')} name="arrow-left" size={30} color="black" style={{paddingLeft:15}} />
                )
            }}
            >

            </Tabs.Screen>
        </Tabs>
        
    );
}


