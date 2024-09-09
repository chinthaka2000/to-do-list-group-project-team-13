import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  textInput: {
    fontSize: 20,
    flex: 1,
    marginLeft: 10,
    color: '#333',
  },
  forgotPassword: {
    color: '#6C63FF',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#6C63FF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    color: '#666',
    marginBottom: 15,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  signupContainer: {
    flexDirection: 'row',
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  // Add these to your styles object
buttonContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},
loadingIndicator: {
  marginLeft: 10,
},
disabledText: {
  opacity: 0.7,
},
});