import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  Platform,
} from 'react-native';
import { PainSlider } from './PainSlider';
import { usePainContext } from '@/context/PainContext';
import { PainEntry } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import * as Haptics from 'expo-haptics';

export default function PainForm() {
  const [bodyPart, setBodyPart] = useState('');
  const [painLevel, setPainLevel] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { addPainEntry } = usePainContext();

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setError('');

    if (!bodyPart.trim()) {
      setError('Please enter a body part');
      return;
    }

    setIsSubmitting(true);

    try {
      // Provide haptic feedback if not on web
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      const newEntry: PainEntry = {
        id: uuidv4(),
        bodyPart: bodyPart.trim(),
        painLevel,
        timestamp: Date.now(),
      };

      await addPainEntry(newEntry);
      
      // Reset form
      setBodyPart('');
      setPainLevel(5);
    } catch (err) {
      setError('Failed to save entry. Please try again.');
      console.error('Error saving pain entry:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Pain Entry</Text>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Body Part</Text>
        <TextInput
          style={styles.input}
          value={bodyPart}
          onChangeText={setBodyPart}
          placeholder="e.g., Lower back, Left knee"
          placeholderTextColor="#95A5A6"
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Pain Intensity (0 = No pain, 10 = Worst pain)
        </Text>
        <Text style={styles.painValue}>
          Current: <Text style={styles.painLevelText}>{painLevel}</Text>
        </Text>
        <PainSlider value={painLevel} onChange={setPainLevel} />
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submittingButton,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Saving...' : 'Save Pain Entry'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A6FA5',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 12,
    fontSize: 16,
    color: '#2C3E50',
  },
  painValue: {
    fontSize: 16,
    color: '#34495E',
    marginVertical: 8,
  },
  painLevelText: {
    fontWeight: 'bold',
    color: '#4A6FA5',
  },
  submitButton: {
    backgroundColor: '#4A6FA5',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submittingButton: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#E74C3C',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FADBD8',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: '500',
  },
});