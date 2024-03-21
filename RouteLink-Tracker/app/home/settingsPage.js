import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, TouchableOpacity, Switch, Linking, Modal, TextInput} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {firebaseGetDisplayName, firebaseGetEmailName, firebaseSetDisplayName, firebaseSetEmail, firebaseSetPassword} from '../../firebaseConfig';
import { router } from 'expo-router';

const Settings = () => {
    const openBugReportForm = () => {
      // // Google Form URL For Report Issue With Appl
      const bugReportFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdd7TMZuFNZx97j-cAkYD1NbhaUp0iz2NrHLDUAJu3WhhcABQ/viewform?usp=pp_url'; 
      Linking.openURL(bugReportFormUrl);
    };

    const [form, setForm] = useState({
      darkMode: false,
    });

    const [username, setUsername] = useState(firebaseGetDisplayName()) //this is the username
    const [password, setPassword] = useState('') //this is the password
    const [email, setEmail] = useState(firebaseGetEmailName()) //this is the email
            
    const setUserName = (text) => {
        setUsername(text)
    }

    const setUserEmail = (text) => {
        setEmail(text)
    }

    const setUserPassword = (text) => {
        setPassword(text)
    }

    const [modalType, setModalType] = useState(null);
    

    const handleChangeEmail = () => {
        setModalType(null);
        firebaseSetEmail(email)
    }

    const handleChangePassword = () => {
      setModalType(null);
      firebaseSetPassword(password)
    }

    const handleChangeUsername = () => {
        setModalType(null);
        firebaseSetDisplayName(username)
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={styles.container}>
            <ScrollView>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>

                <TouchableOpacity
                onPress={() => {
                }}
                style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#515151' }]}>
                    <FeatherIcon 
                    color="#fff" //outline of the icon icon is globe,moon, credit card, and etc
                    name="globe" 
                    size={20} />
                </View>

                <Text style={styles.rowLabel}>Language</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon// color for the and size chevron to go to other tab >
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>

                <View style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                    <FeatherIcon 
                    color="#fff" //outline of the icon icon is globe,moon, credit card, and etc
                    name="moon" 
                    size={20} />
                </View>

                <Text style={styles.rowLabel}>Dark Mode</Text>

                <View style={styles.rowSpacer} />

                <Switch
                    onValueChange={darkMode => setForm({ ...form, darkMode })}
                    value={form.darkMode} />
                </View>

                <TouchableOpacity
                onPress={() => {router.navigate('./subscriptionPage')}}
                style={styles.row}>
                <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                    <FeatherIcon //outline of the icon icon is globe,moon, credit card, and etc
                    color="#fff"
                    name="credit-card"
                    size={20} />
                </View>

                <Text style={styles.rowLabel}>Subscription Plan</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon // color for the and size chevron to go to other tab >
                    color="#C6C6C6" 
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>

            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resources</Text>

                <TouchableOpacity
                  onPress={openBugReportForm}
                  style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                    <FeatherIcon color="#fff" name="flag" size={20} />
                  </View>

                <Text style={styles.rowLabel}>Report Bug</Text>

                <View style={styles.rowSpacer} />

                <FeatherIcon// color for the and size chevron to go to other tab >
                    color="#C6C6C6"
                    name="chevron-right"
                    size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                  }}
                  style={styles.row}>
                  <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
                      <FeatherIcon 
                      color="#fff" 
                      name="mail" 
                      size={20} />

                      
                  </View>
                  <Text style={styles.rowLabel}>Contact Us</Text>

                  <View style={styles.rowSpacer} />

                  <FeatherIcon// color for the and size chevron to go to other tab >
                      color="#C6C6C6"
                      name="chevron-right"
                      size={20} />

                </TouchableOpacity>
            </View>


            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Info</Text>

                <View style={{flex: 1, justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", justifyContent: "space-around", alignContent: "center", marginBottom:20}}>
                        <Text style={styles.accountInfoFields}>Username: {username}</Text>
                        <TouchableOpacity style={styles.accountInfoChangeButton} onPress={() => setModalType("username")}>
                            <Text style={{justifyContent: "center"}}>Change Username</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-around", alignContent: "center", marginBottom:20}}>
                        <Text style={styles.accountInfoFields}>Email: {email}</Text>
                        <TouchableOpacity style={styles.accountInfoChangeButton} onPress={() => setModalType("email")}>
                            <Text style={{justifyContent: "center"}}>Change Email</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flexDirection: "row", justifyContent: "space-around", alignContent: "center"}}>
                        <TouchableOpacity style={[styles.accountInfoChangeButton, {marginLeft: "auto", height:30}]} onPress={() => setModalType("password")}>
                            <Text style={{justifyContent: "center"}}>Change Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            </ScrollView>
        </View>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalType !== null}
            onRequestClose={() => {
                setModalType(null);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>

                    {modalType === 'email' ? (
                        <Text style={styles.modalText}>Change Email</Text> 
                    ) : modalType === 'password' ? (
                        <Text style={styles.modalText}>Change Password</Text> 
                    ) : (
                        <Text style={styles.modalText}>Change Username</Text>                    
                    )}
                
                    {modalType === 'email' ? (
                        <TextInput style={styles.modalInput} onChangeText={setUserEmail} value={email} placeholder="New email"/>
                    ) : modalType === 'password' ? (
                        <TextInput style={styles.modalInput} onChangeText={setUserPassword} value={password} placeholder="New password"/>
                    ) : (
                        <TextInput style={styles.modalInput} onChangeText={setUserName} value={username} placeholder="New username"/>
                    )}

                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setModalType(null)}>
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>


                        {modalType === 'email' ? (
                            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={handleChangeEmail}>
                                <Text style={styles.textStyle}>OK</Text>
                            </TouchableOpacity>
                        ) : modalType === 'password' ? (
                            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={handleChangePassword}>
                                <Text style={styles.textStyle}>OK</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={handleChangeUsername}>
                                <Text style={styles.textStyle}>OK</Text>
                            </TouchableOpacity>
                        )}
                        
                    </View>
                </View>
            </View>
        </Modal>
        </SafeAreaView>
    );
}

export default Settings;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: { // changes the prefrences and resources
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#0c0c0c',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  row: { //changes the tabs for the language, dark mode, subscription plan and etc
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: { //changes the circular icon 
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { //changes font and font color of the language, Darkmode, and subscription plan.
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
  },
  rowSpacer: { // this is the spacing between the row tabs
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },

  accountInfoFields: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
    paddingVertical: 12,
  },
  accountInfoChangeButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    margin: "auto",
    marginBottom: 4,
    marginTop: 4,
    marginLeft: 30,
    paddingLeft: "auto",
    paddingRight: "auto",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonClose: {
    backgroundColor: "#f2f2f2",
    marginLeft: 10,
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalInput: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});
