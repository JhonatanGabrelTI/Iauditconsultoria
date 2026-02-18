import { eq, and, like, or, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  clients, 
  InsertClient,
  Client,
  digitalCertificates,
  InsertDigitalCertificate,
  DigitalCertificate,
  procuracoes,
  InsertProcuracao,
  Procuracao,
  fiscalProcesses,
  InsertFiscalProcess,
  FiscalProcess,
  declarations,
  InsertDeclaration,
  Declaration,
  rbt12Sublimits,
  InsertRbt12Sublimit,
  Rbt12Sublimit,
  ecacMessages,
  InsertEcacMessage,
  EcacMessage,
  notifications,
  InsertNotification,
  Notification,
  fiscalReports,
  InsertFiscalReport,
  FiscalReport,
  settings,
  InsertSettings,
  Settings,
  schedules,
  InsertSchedule,
  Schedule,
  apiConsultas,
  InsertApiConsulta,
  ApiConsulta
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ==================== USER OPERATIONS ====================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ==================== CLIENT OPERATIONS ====================

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(clients).values(client);
  return result;
}

export async function getClientsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateClient(id: number, data: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(clients).set(data).where(eq(clients.id, id));
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(clients).where(eq(clients.id, id));
}

export async function searchClients(userId: number, searchTerm?: string, filters?: {
  regimeTributario?: string;
  personType?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(clients).where(eq(clients.userId, userId));

  const conditions = [eq(clients.userId, userId)];

  if (searchTerm) {
    conditions.push(
      or(
        like(clients.razaoSocialNome, `%${searchTerm}%`),
        like(clients.cnpjCpf, `%${searchTerm}%`)
      )!
    );
  }

  if (filters?.regimeTributario) {
    conditions.push(eq(clients.regimeTributario, filters.regimeTributario as any));
  }

  if (filters?.personType) {
    conditions.push(eq(clients.personType, filters.personType as any));
  }

  return await db.select().from(clients).where(and(...conditions)).orderBy(desc(clients.createdAt));
}

// ==================== DIGITAL CERTIFICATE OPERATIONS ====================

export async function createDigitalCertificate(certificate: InsertDigitalCertificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(digitalCertificates).values(certificate);
}

export async function getDigitalCertificatesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(digitalCertificates).where(eq(digitalCertificates.clientId, clientId));
}

export async function updateDigitalCertificate(id: number, data: Partial<InsertDigitalCertificate>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(digitalCertificates).set(data).where(eq(digitalCertificates.id, id));
}

// ==================== PROCURACAO OPERATIONS ====================

export async function createProcuracao(procuracao: InsertProcuracao) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(procuracoes).values(procuracao);
}

export async function getProcuracoesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(procuracoes).where(eq(procuracoes.clientId, clientId));
}

export async function updateProcuracao(id: number, data: Partial<InsertProcuracao>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(procuracoes).set(data).where(eq(procuracoes.id, id));
}

// ==================== FISCAL PROCESS OPERATIONS ====================

export async function createFiscalProcess(process: InsertFiscalProcess) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(fiscalProcesses).values(process);
}

export async function getFiscalProcessesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(fiscalProcesses).where(eq(fiscalProcesses.clientId, clientId)).orderBy(desc(fiscalProcesses.createdAt));
}

export async function getFiscalProcessesByType(userId: number, processType: string) {
  const db = await getDb();
  if (!db) return [];

  // Join com clients para filtrar por userId
  return await db
    .select({
      process: fiscalProcesses,
      client: clients
    })
    .from(fiscalProcesses)
    .innerJoin(clients, eq(fiscalProcesses.clientId, clients.id))
    .where(and(
      eq(clients.userId, userId),
      eq(fiscalProcesses.processType, processType as any)
    ))
    .orderBy(desc(fiscalProcesses.createdAt));
}

export async function updateFiscalProcess(id: number, data: Partial<InsertFiscalProcess>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(fiscalProcesses).set(data).where(eq(fiscalProcesses.id, id));
}

export async function getFiscalProcessStats(userId: number) {
  const db = await getDb();
  if (!db) return { emDia: 0, pendente: 0, atencao: 0 };

  const result = await db
    .select({
      status: fiscalProcesses.status,
      count: sql<number>`count(*)`.as('count')
    })
    .from(fiscalProcesses)
    .innerJoin(clients, eq(fiscalProcesses.clientId, clients.id))
    .where(eq(clients.userId, userId))
    .groupBy(fiscalProcesses.status);

  const stats = { emDia: 0, pendente: 0, atencao: 0 };
  result.forEach(row => {
    if (row.status === 'em_dia') stats.emDia = Number(row.count);
    if (row.status === 'pendente') stats.pendente = Number(row.count);
    if (row.status === 'atencao') stats.atencao = Number(row.count);
  });

  return stats;
}

// ==================== DECLARATION OPERATIONS ====================

export async function createDeclaration(declaration: InsertDeclaration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(declarations).values(declaration);
}

export async function getDeclarationsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(declarations).where(eq(declarations.clientId, clientId)).orderBy(desc(declarations.createdAt));
}

export async function getDeclarationsByType(userId: number, declarationType: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      declaration: declarations,
      client: clients
    })
    .from(declarations)
    .innerJoin(clients, eq(declarations.clientId, clients.id))
    .where(and(
      eq(clients.userId, userId),
      eq(declarations.declarationType, declarationType as any)
    ))
    .orderBy(desc(declarations.createdAt));
}

export async function updateDeclaration(id: number, data: Partial<InsertDeclaration>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(declarations).set(data).where(eq(declarations.id, id));
}

export async function getDeclarationStats(userId: number, declarationType: string) {
  const db = await getDb();
  if (!db) return { total: 0, declared: 0 };

  const result = await db
    .select({
      declared: declarations.declared,
      count: sql<number>`count(*)`.as('count')
    })
    .from(declarations)
    .innerJoin(clients, eq(declarations.clientId, clients.id))
    .where(and(
      eq(clients.userId, userId),
      eq(declarations.declarationType, declarationType as any)
    ))
    .groupBy(declarations.declared);

  let total = 0;
  let declared = 0;
  result.forEach(row => {
    const count = Number(row.count);
    total += count;
    if (row.declared) declared = count;
  });

  return { total, declared };
}

// ==================== RBT12 SUBLIMIT OPERATIONS ====================

export async function createRbt12Sublimit(sublimit: InsertRbt12Sublimit) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(rbt12Sublimits).values(sublimit);
}

export async function getRbt12SublimitsByUserId(userId: number, limit: number = 10) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      sublimit: rbt12Sublimits,
      client: clients
    })
    .from(rbt12Sublimits)
    .innerJoin(clients, eq(rbt12Sublimits.clientId, clients.id))
    .where(eq(clients.userId, userId))
    .orderBy(desc(rbt12Sublimits.rbt12Value))
    .limit(limit);
}

// ==================== E-CAC MESSAGE OPERATIONS ====================

export async function createEcacMessage(message: InsertEcacMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(ecacMessages).values(message);
}

export async function getEcacMessagesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      message: ecacMessages,
      client: clients
    })
    .from(ecacMessages)
    .innerJoin(clients, eq(ecacMessages.clientId, clients.id))
    .where(eq(clients.userId, userId))
    .orderBy(desc(ecacMessages.messageDate));
}

export async function markEcacMessageAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(ecacMessages).set({ read: true }).where(eq(ecacMessages.id, id));
}

// ==================== NOTIFICATION OPERATIONS ====================

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(notifications).values(notification);
}

export async function getNotificationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
}

export async function searchNotifications(userId: number, searchTerm: string) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        or(
          like(notifications.title, `%${searchTerm}%`),
          like(notifications.description, `%${searchTerm}%`),
          like(notifications.processType, `%${searchTerm}%`)
        )
      )
    )
    .orderBy(desc(notifications.createdAt));
}

// ==================== FISCAL REPORT OPERATIONS ====================

export async function createFiscalReport(report: InsertFiscalReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(fiscalReports).values(report);
}

export async function getFiscalReportsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      report: fiscalReports,
      client: clients
    })
    .from(fiscalReports)
    .innerJoin(clients, eq(fiscalReports.clientId, clients.id))
    .where(eq(clients.userId, userId))
    .orderBy(desc(fiscalReports.createdAt));
}

// ==================== SETTINGS OPERATIONS ====================

export async function getSettingsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(settings).where(eq(settings.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertSettings(userId: number, data: Partial<InsertSettings>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getSettingsByUserId(userId);

  if (existing) {
    return await db.update(settings).set(data).where(eq(settings.userId, userId));
  } else {
    return await db.insert(settings).values({ userId, ...data });
  }
}

// ==================== SCHEDULE OPERATIONS ====================

export async function createSchedule(schedule: InsertSchedule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(schedules).values(schedule);
}

export async function getSchedulesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(schedules).where(eq(schedules.userId, userId)).orderBy(schedules.dayOfMonth);
}

export async function updateSchedule(id: number, data: Partial<InsertSchedule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(schedules).set(data).where(eq(schedules.id, id));
}

export async function deleteSchedule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.delete(schedules).where(eq(schedules.id, id));
}


// ==================== API CONSULTAS ====================

export async function createApiConsulta(consulta: InsertApiConsulta): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(apiConsultas).values(consulta);
}

export async function getApiConsultasByClient(clientId: number): Promise<ApiConsulta[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(apiConsultas).where(eq(apiConsultas.clientId, clientId)).orderBy(desc(apiConsultas.createdAt));
}

export async function getApiConsultasByUser(userId: number): Promise<ApiConsulta[]> {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(apiConsultas).where(eq(apiConsultas.userId, userId)).orderBy(desc(apiConsultas.createdAt));
}

export async function getLatestApiConsulta(
  clientId: number,
  tipoConsulta: "cnd_federal" | "cnd_estadual" | "regularidade_fgts"
): Promise<ApiConsulta | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const results = await db
    .select()
    .from(apiConsultas)
    .where(and(eq(apiConsultas.clientId, clientId), eq(apiConsultas.tipoConsulta, tipoConsulta)))
    .orderBy(desc(apiConsultas.createdAt))
    .limit(1);
  return results[0];
}
