import React from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface PainSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function PainSlider({
  value,
  onChange,
  min = 0,
  max = 10,
}: PainSliderProps) {
  const getColorForPainLevel = (level: number) => {
    if (level <= 3) return '#2ECC71'; // Green for low pain
    if (level <= 6) return '#F39C12'; // Orange for medium pain
    return '#E74C3C'; // Red for high pain
  };

  const handlePress = (newValue: number) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onChange(newValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        {Array.from({ length: max - min + 1 }).map((_, idx) => {
          const currentValue = idx + min;
          const isSelected = currentValue <= value;
          
          return (
            <View
              key={idx}
              style={[
                styles.segment,
                isSelected && { backgroundColor: getColorForPainLevel(value) },
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  isSelected && styles.segmentTextSelected,
                ]}
                onPress={() => handlePress(currentValue)}
              >
                {currentValue}
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>No Pain</Text>
        <Text style={styles.labelText}>Worst Pain</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    padding: 5,
  },
  segment: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginHorizontal: 2,
    borderRadius: 20,
  },
  segmentText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: '500',
  },
  segmentTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelText: {
    color: '#7F8C8D',
    fontSize: 14,
  },
});