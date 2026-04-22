import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';

import SoftButton from './SoftButton';
import { getRetailerAccent, pastelTheme, softShadow } from '../theme/pastel';

function formatPrice(price) {
  return Number.isFinite(price) ? `$${price.toFixed(2)}` : 'Unavailable';
}

function formatTimestamp(value) {
  if (!value) {
    return 'Freshly added';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export default function ItemCard({
  item,
  onAdd,
  onRefresh,
  onDelete,
  onPress,
  adding = false,
  refreshing = false,
  deleting = false,
}) {
  const retailerAccent = getRetailerAccent(item.cheapestRetailer ?? item.retailer);
  const offerCount = Array.isArray(item.offers) ? item.offers.length : 0;
  const cardBadgeLabel = onAdd
    ? 'Ready to save'
    : offerCount > 1
      ? `${offerCount} offers`
      : 'Saved item';

  return (
    <View
      style={[
        styles.card,
        softShadow,
        {
          backgroundColor: retailerAccent.tint,
          borderColor: retailerAccent.border,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={({ pressed }) => [
          styles.headerPressable,
          pressed && onPress ? styles.headerPressableActive : null,
        ]}
      >
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: '#ffffffcc',
                borderColor: retailerAccent.border,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: retailerAccent.text }]}>
              {item.cheapestRetailer ?? item.retailer ?? 'Wishlist find'}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cardBadgeLabel}</Text>
          </View>
        </View>
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
            <View style={styles.pricePill}>
              <Text style={styles.priceLabel}>Best price</Text>
              <Text style={styles.priceValue}>{formatPrice(item.lowestPrice)}</Text>
            </View>
            <Text style={styles.meta}>Retailer: {item.cheapestRetailer ?? item.retailer}</Text>
            <Text style={styles.meta}>Updated: {formatTimestamp(item.lastUpdated)}</Text>
            {onPress ? <Text style={styles.detailHint}>Tap to compare retailer offers</Text> : null}
            {refreshing ? (
              <Text style={styles.refreshStatus}>Fetching new price...</Text>
            ) : null}
          </View>
        </View>
      </Pressable>
      <View style={styles.actions}>
        {onAdd ? (
          <SoftButton
            title={adding ? 'Saving...' : 'Save to wishlist'}
            onPress={onAdd}
            disabled={adding}
            tone="primary"
            fullWidth
          />
        ) : (
          <>
            <View style={styles.actionButton}>
              <SoftButton
                title={refreshing ? 'Refreshing...' : 'Refresh'}
                onPress={onRefresh}
                disabled={refreshing || deleting}
                tone="mint"
                fullWidth
              />
            </View>
            <View style={styles.actionButton}>
              <SoftButton
                title={deleting ? 'Removing...' : 'Remove'}
                onPress={onDelete}
                disabled={refreshing || deleting}
                tone="neutral"
                fullWidth
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    marginVertical: 8,
  },
  headerPressable: {
    padding: 16,
    borderRadius: 24,
  },
  headerPressableActive: {
    backgroundColor: '#ffffff99',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14,
  },
  badge: {
    borderWidth: 1,
    borderColor: pastelTheme.border,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: pastelTheme.surface,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: pastelTheme.heading,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  imageWrapper: {
    width: 92,
    height: 92,
    marginRight: 14,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: '#fffdfd',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    backgroundColor: pastelTheme.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  placeholderText: {
    fontSize: 12,
    color: pastelTheme.muted,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    color: pastelTheme.heading,
  },
  pricePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#ffffffcc',
    borderWidth: 1,
    borderColor: pastelTheme.border,
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: pastelTheme.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: pastelTheme.accentDeep,
  },
  meta: {
    fontSize: 13,
    color: pastelTheme.text,
    marginBottom: 4,
  },
  refreshStatus: {
    fontSize: 13,
    fontWeight: '600',
    color: pastelTheme.mintDeep,
    marginTop: 4,
  },
  detailHint: {
    fontSize: 13,
    fontWeight: '600',
    color: pastelTheme.lavenderDeep,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginRight: 8,
  },
});
