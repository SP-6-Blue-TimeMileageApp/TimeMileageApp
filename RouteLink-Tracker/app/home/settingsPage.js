import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, ScrollView, Text, TouchableOpacity, Switch,Linking } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';

const Settings = () => {
  const openBugReportForm = () => {
    // // Google Form URL For Report Issue With Application
    const bugReportFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdd7TMZuFNZx97j-cAkYD1NbhaUp0iz2NrHLDUAJu3WhhcABQ/viewform?usp=pp_url'; 
    Linking.openURL(bugReportFormUrl);
  };

  const [form, setForm] = useState({
    darkMode: false,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>

            <TouchableOpacity
               onPress={openBugReportForm}
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
              onPress={openBugReportForm}
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
              onPress={openBugReportForm} // Call the function to open the bug report form
              style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
                <FeatherIcon color="#fff" name="flag" size={20} />
              </View>

              <Text style={styles.rowLabel}>Report Bug</Text>

              <View style={styles.rowSpacer} />

              <FeatherIcon
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
        </ScrollView>
      </View>
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
});
