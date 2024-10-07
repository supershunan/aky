import mqtt, { MqttClient, IClientOptions, Packet } from "mqtt";

interface MQTTConfig {
    url: string;
    options?: IClientOptions;
}

interface MQTTMessage {
    topic?: string;
    message?: string;
    time?: string;
}

type ConnectStatus = "Connected" | "Reconnecting" | "Disconnected" | "Error" | "SUBSCRIBE";

export class MQTTClient {
    private client: MqttClient | null = null;
    private connectStatus: ConnectStatus = "Disconnected";
    private messages: MQTTMessage[] = [];
    private config: MQTTConfig;
    private reconnectTimeout: NodeJS.Timeout | null = null;
    private messageCallback: ((messages: MQTTMessage[]) => void) | null = null;
    private statusCallback: ((status: ConnectStatus) => void) | null = null;

    constructor(config: MQTTConfig) {
        this.config = config;
        this.messageCallback = null;
        this.statusCallback = null;
    }

    connect(): void {
        if (this.client) return;

        this.client = mqtt.connect(this.config.url, {
            ...this.config.options,
            reconnectPeriod: 0,
        });

        this.client.on("connect", () => {
            this.connectStatus = "Connected";
            if (this.client && this.statusCallback) {
                this.statusCallback(this.connectStatus)
            }
            console.log("Connected to MQTT broker");
        });

        this.client.on("error", (err) => {
            this.connectStatus = "Error";
            if (this.statusCallback) {
                this.statusCallback(this.connectStatus)
            }
            console.error("Connection error:", err);
            this.client?.end();
        });

        this.client.on("reconnect", () => {
            this.connectStatus = "Reconnecting";
            if (this.statusCallback) {
                this.statusCallback(this.connectStatus)
            }
        });

        this.client.on(
            "message",
            (topic: string, message: Buffer, packet: Packet) => {
                const payload = message.toString();
                this.messages.push({ topic, message: payload, time: new Date().toLocaleString() });

                if (this.messageCallback) {
                    this.messageCallback(this.messages);
                }
            }
        );

        this.client.on("close", () => {
            this.connectStatus = "Disconnected";
            if (this.statusCallback) {
                this.statusCallback(this.connectStatus)
            }
            this.client = null;

            this.reconnectTimeout = setTimeout(() => {
                this.connectStatus = "Reconnecting";
                if (this.statusCallback) {
                    this.statusCallback(this.connectStatus)
                }
                console.log("Attempting to reconnect...");
                this.connect();
            }, 5000);
        });
    }

    disconnect(): void {
        if (this.client) {
            this.client.end();
            this.client = null;
            this.connectStatus = "Disconnected";
            if (this.statusCallback) {
                this.statusCallback(this.connectStatus)
            }
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }
        }
    }

    subscribe(topic: string): void {
        if (this.client) {
            this.client.subscribe(topic, (err) => {
                if (err) {
                    console.error("Subscribe error:", err);
                } else {
                    console.log(`Subscribed to ${topic}`);
                }
            });
            this.connectStatus = "SUBSCRIBE"
            if (this.statusCallback) {
                this.statusCallback(this.connectStatus)
            }
        }
    }

    unsubscribe(topic: string): void {
        if (this.client) {
            this.client.unsubscribe(topic, (err) => {
                if (err) {
                    console.error("Unsubscribe error:", err);
                } else {
                    console.log(`Unsubscribed from ${topic}`);
                }
            });
        }
    }

    publish(topic: string, message: string): void {
        if (this.client) {
            this.client.publish(topic, message, (err) => {
                if (err) {
                    console.error("Publish error:", err);
                }
            });
        }
    }

    getConnectStatus(): ConnectStatus {
        return this.connectStatus;
    }

    getMessages(): MQTTMessage[] {
        return this.messages;
    }

    clearMessages(): void {
        this.messages = [];
    }

    onMessage(callback: ((messages: MQTTMessage[]) => void) | null) {
        this.messageCallback = callback;
    }

    onStatus(callback: ((status: ConnectStatus) => void) | null) {
        this.statusCallback = callback;
    }
}
