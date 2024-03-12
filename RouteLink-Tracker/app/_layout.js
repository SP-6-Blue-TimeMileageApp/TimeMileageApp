import { Stack, useRouter } from "expo-router";

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
                headerBackTitle: 'Back',
            }}
        >
            
            <Stack.Screen name="index" options={{ title: '' }} />
            <Stack.Screen name="loginPage" options={{ title: '' }} />
            <Stack.Screen name="forgotPasswordPage" options={{ title: '' }} />
            <Stack.Screen name="createAccountPage" options={{ title: '' }} />
            <Stack.Screen name="basePage" options={{ title: '' }} />
            
            <Stack.Screen name="loadingPage" options={{headerShown: false}} />
            <Stack.Screen name="home" options={{headerShown: false}} />
        </Stack>
    );

}