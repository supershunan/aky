import { useState, useEffect, useCallback, useRef } from 'react';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

interface MQTTConfig {
  url: string;
  options?: IClientOptions;
}

interface MQTTMessage {
  topic: string;
  message: string;
}

interface MQTTHook {
  client: MqttClient | null;
  connectStatus: 'Connected' | 'Reconnecting' | 'Disconnected';
  messages: MQTTMessage[];
  connect: () => void;
  disconnect: () => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: string) => void;
}

export const useMQTT = (config: MQTTConfig): MQTTHook => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [connectStatus, setConnectStatus] = useState<'Connected' | 'Reconnecting' | 'Disconnected'>('Disconnected');
  const [messages, setMessages] = useState<MQTTMessage[]>([]);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (client) return;

    const mqttClient = mqtt.connect(config.url, {
      ...config.options,
      reconnectPeriod: 0, // 手动处理重连
    });

    mqttClient.on('connect', () => {
      setConnectStatus('Connected');
      console.log('Connected to MQTT broker');
    });

    mqttClient.on('error', (err) => {
      console.error('Connection error:', err);
      mqttClient.end();
    });

    mqttClient.on('reconnect', () => {
      setConnectStatus('Reconnecting');
    });

    mqttClient.on('message', (topic, message) => {
      const payload = message.toString();
      console.log('本地数据', payload)
      setMessages((prev) => [...prev, { topic, message: payload }]);
    });

    mqttClient.on('close', () => {
      setConnectStatus('Disconnected');
      setClient(null);

      /**
       * TODO: 重连
       */
      reconnectTimeout.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connect();
      }, 5000);
    });

    setClient(mqttClient);
  }, [config.url, config.options]);

  const disconnect = useCallback(() => {
    if (client) {
      client.end();
      setClient(null);
      setConnectStatus('Disconnected');
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    }
  }, [client]);

  const subscribe = useCallback((topic: string) => {
    if (client) {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscribe error:', err);
        } else {
          console.log(`Subscribed to ${topic}`);
        }
      });
    }
  }, [client]);

  const unsubscribe = useCallback((topic: string) => {
    if (client) {
      client.unsubscribe(topic, (err) => {
        if (err) {
          console.error('Unsubscribe error:', err);
        } else {
          console.log(`Unsubscribed from ${topic}`);
        }
      });
    }
  }, [client]);

  const publish = useCallback((topic: string, message: string) => {
    if (client) {
      client.publish(topic, message, (err) => {
        if (err) {
          console.error('Publish error:', err);
        }
      });
    }
  }, [client]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    client,
    connectStatus,
    messages,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    publish,
  };
};