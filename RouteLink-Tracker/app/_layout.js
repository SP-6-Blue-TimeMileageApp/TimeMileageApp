import { Stack, useRouter, Tabs } from "expo-router";

export default () => {

    const router = useRouter();

    return (
        <Stack 
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#515151',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            
            <Stack.Screen name="index" options={{ title: '' }} />
            <Stack.Screen name="loginPage" options={{ title: '' }} />
            <Stack.Screen name="forgotPasswordPage" options={{ title: '' }} />
            <Stack.Screen name="createAccountPage" options={{ title: '' }} />
            
            <Stack.Screen name="home" options={{headerShown: false}} />
        </Stack>
    );

}