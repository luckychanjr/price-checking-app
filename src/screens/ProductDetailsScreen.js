import React from 'react';
import {
  Alert,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import SoftButton from '../components/SoftButton';
import { getRetailerAccent, pastelTheme, softShadow } from '../theme/pastel';

function formatPrice(price) {
  return Number.isFinite(price) ? `$${price.toFixed(2)}` : 'Unavailable';
}

function formatTimestamp(value) {
  if (!value) {
    return 'Unknown';
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString();
}

export default function ProductDetailsScreen({ route }) {
  const item = route?.params?.item;
  const offers = Array.isArray(item?.offers) ? item.offers : [];

  const openOfferLink = async (url) => {
    if (!url) {
      Alert.alert('Missing Link', 'This retailer offer does not include a product link yet.');
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert('Cannot Open Link', 'Your device could not open this retailer link.');
        return;
      }

      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Link Error', err.message || 'Unable to open the retailer link.');
    }
  };

  if (!item) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>No product data available.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.heroCard, softShadow]}>
          <View style={styles.heroDecorationLarge} />
          <View style={styles.heroDecorationSmall} />
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.heroImage} resizeMode="contain" />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroPlaceholderText}>No image yet</Text>
            </View>
          )}
          <View style={styles.heroContent}>
            <View style={styles.heroBadgeRow}>
              <View style={[styles.heroBadge, styles.heroBadgeWarm]}>
                <Text style={styles.heroBadgeText}>{offers.length} matched offers</Text>
              </View>
              <View style={[styles.heroBadge, styles.heroBadgeMint]}>
                <Text style={styles.heroBadgeText}>{formatPrice(item.lowestPrice)}</Text>
              </View>
            </View>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.summary}>Cheapest retailer: {item.cheapestRetailer}</Text>
            <Text style={styles.summary}>Last updated: {formatTimestamp(item.lastUpdated)}</Text>
            {item.sourceInput ? (
              <Text style={styles.sourceText}>Search source: {item.sourceInput}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>Comparison board</Text>
          <Text style={styles.sectionTitle}>Retailer offers</Text>
          <Text style={styles.sectionDescription}>
            Compare the grouped matches and jump out to a retailer when you want to double-check a
            listing.
          </Text>
        </View>

        {offers.length === 0 ? (
          <View style={[styles.emptyOffersCard, softShadow]}>
            <Text style={styles.emptyOffersText}>No retailer offers were saved for this item.</Text>
            <Text style={styles.emptyOffersHint}>
              Refreshing this product later may bring in more matches.
            </Text>
          </View>
        ) : (
          offers.map((offer, index) => (
            <View
              key={`${offer.retailer}-${offer.retailerId || index}`}
              style={[
                styles.offerCard,
                softShadow,
                {
                  backgroundColor: getRetailerAccent(offer.retailer).tint,
                  borderColor: getRetailerAccent(offer.retailer).border,
                },
              ]}
            >
              <View style={styles.offerHeader}>
                <View
                  style={[
                    styles.offerRetailerBadge,
                    {
                      borderColor: getRetailerAccent(offer.retailer).border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.offerRetailer,
                      {
                        color: getRetailerAccent(offer.retailer).text,
                      },
                    ]}
                  >
                    {offer.retailer}
                  </Text>
                </View>
                <Text style={styles.offerPrice}>{formatPrice(offer.price)}</Text>
              </View>
              <Text style={styles.offerName}>{offer.name}</Text>
              {offer.url ? (
                <Text style={styles.offerUrl} numberOfLines={2}>
                  {offer.url}
                </Text>
              ) : (
                <Text style={styles.offerUrlMissing}>No retailer link available</Text>
              )}
              <View style={styles.offerAction}>
                <SoftButton
                  title="Open retailer link"
                  onPress={() => openOfferLink(offer.url)}
                  tone={getRetailerAccent(offer.retailer).buttonTone}
                />
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: pastelTheme.background,
  },
  container: {
    padding: 16,
    paddingBottom: 28,
    backgroundColor: pastelTheme.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: pastelTheme.background,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: pastelTheme.heading,
  },
  heroCard: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: pastelTheme.surface,
    borderRadius: 28,
    padding: 16,
    borderWidth: 1,
    borderColor: pastelTheme.border,
    marginBottom: 18,
  },
  heroDecorationLarge: {
    position: 'absolute',
    top: -24,
    right: -10,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: pastelTheme.accentSoft,
  },
  heroDecorationSmall: {
    position: 'absolute',
    bottom: 18,
    left: -16,
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: '#fff3bf',
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: 22,
    backgroundColor: pastelTheme.surfaceAlt,
    marginBottom: 16,
  },
  heroPlaceholder: {
    width: '100%',
    height: 220,
    borderRadius: 22,
    backgroundColor: pastelTheme.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroPlaceholderText: {
    fontSize: 16,
    color: pastelTheme.muted,
  },
  heroContent: {
    gap: 6,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  heroBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
  },
  heroBadgeWarm: {
    backgroundColor: pastelTheme.sunshine,
    borderColor: '#e5cb83',
  },
  heroBadgeMint: {
    backgroundColor: pastelTheme.mint,
    borderColor: '#a5dbc8',
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: pastelTheme.heading,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: pastelTheme.heading,
    marginBottom: 4,
  },
  summary: {
    fontSize: 15,
    color: pastelTheme.text,
  },
  sourceText: {
    fontSize: 13,
    color: pastelTheme.muted,
    marginTop: 4,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: pastelTheme.accentDeep,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: pastelTheme.heading,
    marginBottom: 6,
  },
  sectionDescription: {
    fontSize: 14,
    color: pastelTheme.text,
  },
  emptyOffersCard: {
    backgroundColor: pastelTheme.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: pastelTheme.border,
  },
  emptyOffersText: {
    fontSize: 15,
    fontWeight: '700',
    color: pastelTheme.heading,
  },
  emptyOffersHint: {
    fontSize: 13,
    color: pastelTheme.text,
    marginTop: 6,
  },
  offerCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  offerRetailerBadge: {
    borderWidth: 1,
    borderRadius: 999,
    backgroundColor: '#ffffffcc',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  offerRetailer: {
    fontSize: 14,
    fontWeight: '700',
  },
  offerPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: pastelTheme.accentDeep,
  },
  offerName: {
    fontSize: 15,
    color: pastelTheme.heading,
    marginBottom: 10,
  },
  offerUrl: {
    fontSize: 13,
    color: pastelTheme.lavenderDeep,
    marginBottom: 12,
  },
  offerUrlMissing: {
    fontSize: 13,
    color: pastelTheme.muted,
    marginBottom: 12,
  },
  offerAction: {
    alignSelf: 'flex-start',
  },
});
