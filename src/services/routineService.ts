import { db } from "../database/db";

import type { RoutineSection, RoutineActivity } from "../types/routine";

export const routineService = {
  async getSections(): Promise<RoutineSection[]> {
    return db.routineSections.orderBy("position").toArray();
  },

  async getSectionById(id: string): Promise<RoutineSection | undefined> {
    return db.routineSections.get(id);
  },

  async createSection(
    data: Omit<RoutineSection, "id">,
  ): Promise<RoutineSection> {
    const section: RoutineSection = {
      ...data,
      id: crypto.randomUUID(),
    };

    await db.routineSections.add(section);

    return section;
  },

  async updateSection(
    id: string,
    changes: Partial<Omit<RoutineSection, "id">>,
  ): Promise<void> {
    const updated = await db.routineSections.update(id, changes);

    if (updated === 0) {
      throw new Error("Seção não encontrada.");
    }
  },

  async removeSection(id: string): Promise<boolean> {
    return db.transaction(
      "rw",
      db.routineSections,
      db.routineActivities,
      async () => {
        const associatedActivities = await db.routineActivities
          .where("sectionId")
          .equals(id)
          .count();

        if (associatedActivities > 0) {
          return false;
        }

        await db.routineSections.delete(id);
        return true;
      },
    );
  },

  async getActivitiesBySection(sectionId: string): Promise<RoutineActivity[]> {
    const activities = await db.routineActivities
      .where("sectionId")
      .equals(sectionId)
      .toArray();

    return activities.sort((a, b) => a.position - b.position);
  },

  async createActivity(
    data: Omit<RoutineActivity, "id">,
  ): Promise<RoutineActivity> {
    const section = await db.routineSections.get(data.sectionId);

    if (!section) {
      throw new Error("Seção da rotina não encontrada.");
    }

    const activity: RoutineActivity = {
      ...data,
      id: crypto.randomUUID(),
    };

    await db.routineActivities.add(activity);

    return activity;
  },

  async updateActivity(
    id: string,
    changes: Partial<Omit<RoutineActivity, "id">>,
  ): Promise<void> {
    const updated = await db.routineActivities.update(id, changes);

    if (updated === 0) {
      throw new Error("Atividade não encontrada.");
    }
  },

  async removeActivity(id: string): Promise<void> {
    const existing = await db.routineActivities.get(id);

    if (!existing) {
      throw new Error("Atividade não encontrada.");
    }

    await db.routineActivities.delete(id);
  },
};
