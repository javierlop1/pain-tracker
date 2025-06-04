import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Platform } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { PainEntry } from '@/types';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';

interface PainHistoryItemProps {
  entry: PainEntry;
  onDelete: () => void;
}

export default function PainHistoryItem({ entry, onDelete }: PainHistoryItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getPainLevelColor = (level: number) => {
    if (level <= 3) return '#2ECC71'; // Green for low pain
    if (level <= 6) return '#F39C12'; // Orange for medium pain
    return '#E74C3C'; // Red for high pain
  };
  
  const getPainLevelText = (level: number) => {
    if (level <= 3) return 'Mild';
    if (level <= 6) return 'Moderate';
    return 'Severe';
  };
  
  const handleDelete = () => {
    if (Platform.OS === 'web') {
      // Web doesn't have Alert API, use confirm instead
      if (window.confirm('Are you sure you want to delete this pain entry?')) {
        deleteEntry();
      }
    } else {
      Alert.alert(
        'Delete Entry',
        'Are you sure you want to delete this pain entry?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            onPress: deleteEntry,
            style: 'destructive' 
          },
        ]
      );
    }
  };
  
  const deleteEntry = () => {
    // Provide haptic feedback on deletion if not on web
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    
    setIsDeleting(true);
    
    // Short delay to allow animation to complete
    setTimeout(() => {
      onDelete();
    }, 300);
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      layout={Layout.springify()}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.bodyPart}>{entry.bodyPart}</Text>
          <View 
            style={[
              styles.painBadge, 
              { backgroundColor: getPainLevelColor(entry.painLevel) }
            ]}
          >
            <Text style={styles.painBadgeText}>
              {entry.painLevel}/10 • {getPainLevelText(entry.painLevel)}
            </Text>
          </View>
        </View>
        
        <Text style={styles.timestamp}>{formatDate(entry.timestamp)}</Text>
        
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 size={18} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 16,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bodyPart: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    flex: 1,
  },
  painBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  painBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 4,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    padding: 4,
  },
});