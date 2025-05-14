import { StyleSheet, Dimensions } from "react-native";
const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  /* Main Screen */
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 40,
    zIndex: 2, 
    pointerEvents: 'box-none',
  },

  /* Camera View */
  cameraView: {
    top: 0,
    left: 0,
    right: 0,  
    bottom: 0,
    zIndex: 1, // This puts it behind other elements 
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },

  /* Settings and Camera Button's Placement */
  upperButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    padding: 16,
    paddingTop: 40,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    zIndex: 2
  },

  rightButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    top: 104,
    right: 0
  },

  /* Icon Button Size */
  cameraIcon: {
    width: 53,
    height: 53,
  },

  eyeIcon: {
    width: 45,
    height: 45,
  },

  restartIcon: {
    width: 45,
    height: 45,
  },

  buttonIcon:{
    width: 45,
    height: 45,
  },

  /* (1) Text Input/Output */
  textContainer: {
    position: 'absolute',
    bottom: 10, 
    left: '5%',
    right: '5%',
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
    zIndex: 3,
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
    
  micButton:{
    position: 'absolute',
    bottom: 50,
    right: 10
  },

  /* Translate Container */
  transContainer: {
    position: 'absolute',
    bottom: 170, 
    left: '5%',
    right: '5%',
    backgroundColor: 'rgba(8, 48, 129, 0.7)',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 55,
    zIndex: 30
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
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 15, 
  },
  switchIcon: { // (2)
    marginTop: 5,
    width: 35,
    height: 25,
  },

  videoContainer: {
    flexGrow: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    minHeight: screenHeight,
    justifyContent: 'center',
    alignItems: 'center'
  },
  video: {
    width: screenWidth,
    height: screenHeight,
  },
  closeText: {
    marginTop: 20,
    fontSize: 18,
    color: 'white',
    textDecorationLine: 'underline',
    fontFamily: 'Akatab-SemiBold',
  },
  noVideoText: {
    color: 'gray',
    marginTop: 120,
    marginLeft: 60,
    position: 'absolute',
    fontSize: 14,
}
});