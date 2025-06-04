import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import PainForm from '@/components/PainForm';
import { PainProvider } from '@/context/PainContext';

export default function LogPainScreen() {
  return (
    <PainProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          <PainForm />
        </View>
      </ScrollView>
    </PainProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F7F9FC',
    padding: 16,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 16,
  },
});