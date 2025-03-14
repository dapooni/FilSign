import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    /* Main Screen */
    mainContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: 'rgba(8, 48, 129, 0.9)'
    },

    /* Camera View */
    camera: {
      flex: 0,
      height: '80%',
      width: '100%', 
    },

    /* Settings and Camera Button's Placement */
    upperButtons: {
      flex: 1,
      flexDirection: 'row',
      padding: 20,
      paddingTop: 44,
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },

    /* Camera Icon Button Size */
    cameraIcon: {
      width: 50,
      height: 50,
    },

    /* (1) Text Input/Output */
    textContainer: {
      width: '90%', 
      height: 150,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      borderRadius: 30,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 6.27,
      elevation: 10, 
      alignSelf: 'center',
      marginTop: -15
    },
    text: {  // (2)
      flex: 1,
      fontSize: 16,
      color: '#000',
      padding: 10,
      fontFamily: 'AlbertSans-Medium'
    },
    speakerButton: { // (3)
      position: 'absolute',
      bottom: 10,
      right: 10
    },

    /* Translate Container */
    transContainer: {
      width: '90%',
      backgroundColor: 'rgba(8, 48, 129, 0.7)',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexDirection: 'row',
      borderRadius: 30,
      paddingBottom: 15,
      alignSelf: 'center',
      marginTop: -100,
      marginBottom: 30,
      height: 55,
    },
    
    /* Two Container for TranslateDropDown */
    transDropdown: {
      width: '45%', 
      height: 55,
      borderRadius: 30,
    },

    /* Switch Button (1) */
    circle: {
      width: 35, 
      height: 35,
      marginTop: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 15, 
    },
    switchIcon: { // (2)
      marginTop: 5,
      width: 35,
      height: 25,
    }
  });
