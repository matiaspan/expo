import { Host, HStack, Image, Text as UIText, VStack } from '@expo/ui/swift-ui';
import {
  aspectRatio,
  font,
  foregroundStyle,
  frame,
  renderingMode,
  resizable,
} from '@expo/ui/swift-ui/modifiers';
import { useAssets } from 'expo-asset';
import type { LiveActivity } from 'expo-widgets';
import { useState } from 'react';
import { Button, ScrollView, Text, View } from 'react-native';

import TestActivity from './TestActivity';

type Instance = LiveActivity<{ label: string; score: number }>;

export default function App() {
  const [log, setLog] = useState<string[]>([]);
  const [assets] = useAssets([require('./logo-wordmark.png')]);
  const wordmarkUri = assets?.[0]?.localUri;
  const [instances, setInstances] = useState<Record<string, Instance>>({});
  const add = (line: string) => setLog((l) => [...l, line]);

  const start = (label: string, score: number) => {
    try {
      const instance = TestActivity.start({ label, score }, undefined, undefined, score);
      setInstances((i) => ({ ...i, [label]: instance }));
      add(`started ${label} score=${score} id=${instance.getId()}`);
    } catch (e) {
      add(`start ${label} failed: ${String(e)}`);
    }
  };

  const update = async (label: string, score: number) => {
    try {
      await instances[label]?.update({ label, score }, undefined, score);
      add(`updated ${label} score=${score}`);
    } catch (e) {
      add(`update ${label} failed: ${String(e)}`);
    }
  };

  const endAll = async () => {
    for (const instance of TestActivity.getInstances()) {
      await instance.end('default');
    }
    add(`ended all with default policy`);
  };

  const listInstances = () => {
    const active = TestActivity.getInstances().map((i) => i.getId());
    const ended = TestActivity.getEndedInstances().map((i) => i.getId());
    add(`getInstances: [${active.join(', ')}]`);
    add(`getEndedInstances: [${ended.join(', ')}]`);
  };

  const removeEnded = async () => {
    for (const instance of TestActivity.getEndedInstances()) {
      await instance.end('immediate');
    }
    add(`removed ended instances`);
  };

  return (
    <View style={{ flex: 1, paddingTop: 70, paddingHorizontal: 16 }}>
      <Button title="Start A (score 10)" onPress={() => start('A', 10)} />
      <Button title="Start B (score 90)" onPress={() => start('B', 90)} />
      <Button title="Update A to score 100" onPress={() => update('A', 100)} />
      <Button title="End all (default policy)" onPress={endAll} />
      <Button title="List instances" onPress={listInstances} />
      <Button title="Remove ended (immediate)" onPress={removeEnded} />
      {wordmarkUri && (
        <Host matchContents>
          <HStack spacing={16}>
            {(['original', 'template'] as const).map((mode) => (
              <VStack key={mode} alignment="center" spacing={8}>
                <UIText modifiers={[font({ size: 12 })]}>renderingMode {mode}</UIText>
                <Image
                  uiImage={wordmarkUri}
                  modifiers={[
                    renderingMode(mode),
                    resizable(),
                    aspectRatio({ contentMode: 'fit' }),
                    frame({ width: 140, height: 90 }),
                    foregroundStyle({ type: 'color', color: '#E74C3C' }),
                  ]}
                />
              </VStack>
            ))}
          </HStack>
        </Host>
      )}
      <ScrollView style={{ marginTop: 12 }}>
        {log.map((line, i) => (
          <Text key={i} style={{ fontFamily: 'Menlo', fontSize: 11 }} testID={`log-${i}`}>
            {line}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}
