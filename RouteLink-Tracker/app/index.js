import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Page() {
    const router = useRouter();


    setTimeout(() => {

        while(router.canGoBack()) {
            router.back();
        }
        router.replace('/basePage');

    }, 10);



    return (
    <View style={styles.container}>
    </View>)
  
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 24,
        backgroundColor: '#515151',
    },
    imageContainer:{
        position: "relative",
    },

})

