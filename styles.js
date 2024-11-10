import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({

  // LAYOUT // 
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },

  // TEXT STYLES // 
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  normalText: {
    fontSize: 16,
    fontWeight: '500',
  },
  boldText: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  // BUTTON STYLES //
  button: {
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 10,
    alignItems: 'center',
    elevation: 2,  // Android shadow
    shadowColor: '#000',  // iOS shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: '#2196F3',
  },
  fullButton: {
    flex: 1,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});