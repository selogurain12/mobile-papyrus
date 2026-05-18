import { View, ViewProps } from "react-native";
import React, { forwardRef } from "react";

type TimelineContentProps = ViewProps;

const TimelineContent = forwardRef<View, TimelineContentProps>(({ style, ...props }, ref) => {
  return (
    <View
      ref={ref}
      style={[
        {
          paddingLeft: 16,
          paddingBottom: 24,
          rowGap: 4,
          flex: 1,
        },
        style,
      ]}
      {...props}
    />
  );
});

TimelineContent.displayName = "TimelineContent";

export { TimelineContent };
