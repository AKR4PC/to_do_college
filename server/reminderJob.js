/**
 * Reminder job — runs every 30 minutes.
 * Creates a Notification for tasks due within 7 hours that haven't been reminded yet.
 */
const Task = require('./models/Task');
const Notification = require('./models/Notification');

async function checkReminders() {
  const now = new Date();
  const in7h = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const tasks = await Task.find({
    dueDateISO: { $gte: now, $lte: in7h },
    reminderSent: false,
    columnId: { $ne: 'done' },
  });

  for (const task of tasks) {
    await Notification.create({
      userId: task.userId,
      taskId: task._id,
      text: `⏰ Reminder: "${task.title}" is due in less than 7 hours!`,
      type: 'reminder',
    });
    task.reminderSent = true;
    await task.save();
  }

  if (tasks.length > 0) {
    console.log(`🔔 Sent ${tasks.length} reminder(s)`);
  }
}

module.exports = function startReminderJob() {
  checkReminders(); // run immediately on start
  setInterval(checkReminders, 30 * 60 * 1000); // then every 30 min
};
