import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity, Modal, TextInput, Image} from 'react-native';
import { firebaseGetPremiumStatus, firebaseSetPremiumStatus } from '../../firebaseConfig';
import testImage from "../../assets/bannerAd.jpg";

const subscriptionPay = () => {

    useEffect(() => {
        firebaseGetPremiumStatus().then(status => setPremiumStatus(status)).catch(error => console.log(error));

    }, [premiumStatus]);


    const [premiumStatus, setPremiumStatus] = useState(firebaseGetPremiumStatus());
    const [freeModalVisible, setFreeModalVisible] = useState()
    const [modalVisible, setModalVisible] = useState()

    const setPremiumTrue = async () => {
        setModalVisible(false)
        await firebaseSetPremiumStatus(true)
        setPremiumStatus(true)
        console.log("You have successfully subscribed to the premium version of the app.")

    }

    const setPremiumFalse = async () => {
        setFreeModalVisible(false)
        await firebaseSetPremiumStatus(false)
        setPremiumStatus(false)
        console.log("You have successfully subscribed to the free version of the app.")
    }
      
    return(
        <SafeAreaView>

            {!premiumStatus && (
                <View style={styles.bannerAd}>
                    <Image source={testImage} style={styles.adImage} />
                </View>
            )}

            <View style={styles.container}>

                <View style={{flexDirection: "column", alignItems: "center"}}>
                  <TouchableOpacity onPress={() => setFreeModalVisible(true)} style={styles.button} >
                    <View style={[styles.box]}>
                    <Text style={styles.subscriptionText}>Free Subscription</Text>
                    <Text>-Ads are displayed throughout app</Text>
                    <Text style={styles.PriceText}>$0/month</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
                    <View style={[styles.box]}>
                    <Text style={styles.subscriptionText}>Paid Subscription</Text>
                    <Text>-No Ads</Text>
                    <Text style={styles.PriceText}>$5.00/month</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                

            </View>

            <Modal
            animationType="slide"
            transparent={true}
            visible={freeModalVisible=== true}
            onRequestClose={() => {
                setFreeModalVisible(false);
            }}
            >
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text>Thanks, you will continue using the free version of the app.</Text>
            <TouchableOpacity onPress={setPremiumFalse} style={{borderWidth: 2}}>
              <Text>close</Text>
            </TouchableOpacity>
          </View>
          </View>
            </Modal>

            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible === true}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.modalContainer}>
                        <Text>Enter Cardholders Name: </Text>
                        <TextInput
                        style ={styles.input}
                        placeholder='Ex. John Doe'
                        placeholderTextColor='grey'
                        />
                        <Text>Enter Card Number: </Text>
                        <TextInput
                        style ={styles.input}
                        placeholder='Ex. 0000 0000 0000 0000'
                        placeholderTextColor='grey'
                        />
                        <Text>Enter Card Expiration Date: </Text>
                        <TextInput
                        style ={styles.input}
                        placeholder='Ex. Month/Year 01/33'
                        placeholderTextColor='grey'
                        />
                        <Text>Enter Card Security Code: </Text>
                        <TextInput
                        style ={styles.input}
                        placeholder='Ex. 000 or 0000'
                        placeholderTextColor='grey'
                        />

                        <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={{borderWidth: 2, margin:5}}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={setPremiumTrue} style={{borderWidth: 2, margin:5}}>
                            <Text>Submit</Text>
                        </TouchableOpacity>
                        </View>

                        
                    </View>
                </View>
                </View>
                    
            </Modal>
        </SafeAreaView>
           


    )
};


export default subscriptionPay;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#515151', alignContent: "center", justifyContent: "center"},

    box: {
        width: 275,
        height: 100,
        padding: 5,
        alignContent: 'center',
        margin:10,
        borderWidth: 2,
        borderColor: "black",
        borderRadius: 5,
        backgroundColor:"lightgrey",
  },
  button: {
    margin: 90,
  },
  subscriptionText:{
    fontSize: 18,
    marginVertical:2,
  },
  PriceText:{
    fontSize: 16,
    fontWeight: 'bold',
  }, 
  modalContainer:{
    flex: 1, 
    backgroundColor: "white", 
    alignItems: 'center',
    justifyContent: 'center' 
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    marginTop: 150,
    marginBottom: 150,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    borderWidth: 1,
    bordercolor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
    borderRadius: 2,
  },
    bannerAd: {
        height: 50,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    adImage: {
        width: '100%',
        height: '100%',
    },

})