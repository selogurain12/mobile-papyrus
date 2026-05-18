import { View, ViewProps } from "react-native";
import React, { forwardRef } from "react";

type TimelineItemProps = ViewProps;

const TimelineItem = forwardRef<View, TimelineItemProps>(({ style, ...props }, ref) => {
  return (
    <View
      ref={ref}
      style={[
        {
          display: "flex",
          flexDirection: "row",
        },
        style,
      ]}
      {...props}
    />
  );
});

TimelineItem.displayName = "TimelineItem";

export { TimelineItem };
