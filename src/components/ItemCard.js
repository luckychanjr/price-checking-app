import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

export default function ItemCard({
  item,
  onRefresh,
  onDelete,
  refreshing = false,
  deleting = false,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.imageWrapper}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>Best Price: ${item.lowestPrice.toFixed(2)}</Text>
          <Text style={styles.meta}>Retailer: {item.cheapestRetailer}</Text>
          <Text style={styles.meta}>Updated: {item.lastUpdated}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Button
            title={refreshing ? 'Refreshing...' : 'Refresh'}
            onPress={onRefresh}
            disabled={refreshing || deleting}
          />
        </View>
        <View style={styles.actionButton}>
          <Button
            title={deleting ? 'Removing...' : 'Remove'}
            onPress={onDelete}
            disabled={refreshing || deleting}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 92,
    height: 92,
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#111827',
  },
  meta: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
});
