import React from "react";
import {
  View,
  Dimensions,
  Animated,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import CreditCard from "@/components/CreditCard";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.8;
const SPACING = -50;
const SIDE_CARD_VISIBLE_WIDTH = (screenWidth - CARD_WIDTH) / 2;

interface HorizontalCardSliderProps {
  cards: any[];
}

const HorizontalCardSlider = ({ cards }: HorizontalCardSliderProps) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const flatListRef = React.useRef<FlatList>(null);
  const isSnapping = React.useRef(false);

  const dataWithSpacers = [
    { id: "left-spacer", spacer: true },
    ...cards.map((c, i) => ({ ...c, id: `card-${i}` })),
    { id: "right-spacer", spacer: true },
  ];

  const snapToNearest = (offsetX: number) => {
    if (isSnapping.current) return;

    const cardFullSize = CARD_WIDTH + SPACING;
    let index = Math.round(offsetX / cardFullSize);
    index = Math.min(Math.max(index, 1), dataWithSpacers.length - 2);

    const snapOffset = index * cardFullSize;

    if (Math.abs(snapOffset - offsetX) > 1) {
      isSnapping.current = true;
      flatListRef.current?.scrollToOffset({
        offset: snapOffset,
        animated: true,
      });
      setTimeout(() => {
        isSnapping.current = false;
      }, 300);
    }
  };

  const onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    snapToNearest(e.nativeEvent.contentOffset.x);
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    snapToNearest(e.nativeEvent.contentOffset.x);
  };

  return (
    <Animated.FlatList
      ref={flatListRef}
      data={dataWithSpacers}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      bounces={false}
      snapToInterval={CARD_WIDTH + SPACING}
      contentContainerStyle={{}}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true },
      )}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollEnd={onMomentumScrollEnd}
      renderItem={({ item, index }) => {
        if (item.spacer) {
          return <View style={{ width: SIDE_CARD_VISIBLE_WIDTH }} />;
        }

        const cardFullSize = CARD_WIDTH + SPACING;
        const inputRange = [
          cardFullSize * (index - 2),
          cardFullSize * (index - 1),
          cardFullSize * index,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.9, 0.9, 0.9],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.5, 1, 0.5],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={{
              transform: [{ scale }],
              opacity,
              marginRight: SPACING,
              alignSelf: "center",
              width: CARD_WIDTH,
            }}
          >
            <CreditCard card={item} />
          </Animated.View>
        );
      }}
    />
  );
};

export default HorizontalCardSlider;
