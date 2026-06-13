import { Request, Response } from 'express';
import { Prospect } from '../models/Prospect';

export async function funnel(_req: Request, res: Response): Promise<void> {
  const grouped = await Prospect.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const byStatus: Record<string, number> = {};
  grouped.forEach((g: { _id: string; count: number }) => {
    byStatus[g._id] = g.count;
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const open = { status: { $nin: ['met', 'not_interested'] } };

  const dueTodayCount = await Prospect.countDocuments({ ...open, followUpAt: { $gte: startOfToday, $lte: endOfToday } });
  const overdueCount = await Prospect.countDocuments({ ...open, followUpAt: { $lt: startOfToday } });

  res.json({ byStatus, dueTodayCount, overdueCount });
}
