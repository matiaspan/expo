import { Text, VStack } from '@expo/ui/swift-ui';
import { font, padding } from '@expo/ui/swift-ui/modifiers';
import { createLiveActivity, type LiveActivityEnvironment } from 'expo-widgets';

type TestActivityProps = { label: string; score: number };

const TestActivity = (props: TestActivityProps, environment: LiveActivityEnvironment) => {
  'widget';
  return {
    banner: (
      <VStack modifiers={[padding({ all: 12 })]}>
        <Text modifiers={[font({ weight: 'bold', size: 18 })]}>
          {props.label} (relevanceScore {props.score})
        </Text>
        <Text modifiers={[font({ size: 12 })]}>activityId: {environment.activityId ?? 'missing'}</Text>
      </VStack>
    ),
    compactLeading: <Text>{props.label}</Text>,
    compactTrailing: <Text>{props.score}</Text>,
    minimal: <Text>{props.label}</Text>,
  };
};

export default createLiveActivity('TestActivity', TestActivity);
