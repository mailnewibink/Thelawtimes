import type { SourceConnector } from "./types";
import { MahkamahAgungConnector } from "./adapters/ma-putusan";
import { JdihnConnector } from "./adapters/jdihn";
import { ManualImportConnector } from "./adapters/manual";

class ConnectorRegistry {
  private connectors = new Map<string, SourceConnector>();

  constructor() {
    this.register(new MahkamahAgungConnector());
    this.register(new JdihnConnector());
    this.register(new ManualImportConnector());
  }

  register(connector: SourceConnector): void {
    this.connectors.set(connector.id, connector);
  }

  get(id: string): SourceConnector | undefined {
    return this.connectors.get(id);
  }

  list(): SourceConnector[] {
    return Array.from(this.connectors.values());
  }
}

export const sourceRegistry = new ConnectorRegistry();
