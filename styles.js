import { StyleSheet } from 'react-native';

export const colors = {
  pink: '#F5DAD2',    // Light pink
  cream: '#FCFFE0',   // Light cream
  sage: '#BACD92',    // Sage green
  forest: '#75A47F'   // Forest green
};

export const navigationStyles = {
  headerStyle: {
    backgroundColor: colors.sage,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

export const globalStyles = StyleSheet.create({
  // screen container style //
  screenContainer: {
    flex: 1,
    backgroundColor: colors.cream,
  },

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
    backgroundColor: colors.forest,
  },
  fullButton: {
    flex: 1,
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cancelButton: {
    backgroundColor: '#E38E49',
  },
  saveButton: {
    backgroundColor: '#75A47F',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});