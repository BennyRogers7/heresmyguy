// Weekly posting schedule for TikTok
// 10 posts/week: Mon/Wed/Fri = 2 posts, other days = 1
// Best times: 6-8am, 12-1pm, 7-9pm CT

export const schedule = {
  // Posts per day of week (0 = Sunday)
  postsPerDay: {
    0: 1, // Sunday
    1: 2, // Monday
    2: 1, // Tuesday
    3: 2, // Wednesday
    4: 1, // Thursday
    5: 2, // Friday
    6: 1  // Saturday
  },

  // Optimal posting times in CT (Central Time)
  postTimes: [
    { hour: 7, minute: 0, label: 'Early Morning (7am CT)' },
    { hour: 12, minute: 30, label: 'Lunch (12:30pm CT)' },
    { hour: 19, minute: 30, label: 'Evening (7:30pm CT)' }
  ],

  // Get posting times for a specific day
  getTimesForDay(dayOfWeek) {
    const numPosts = this.postsPerDay[dayOfWeek];
    if (numPosts === 1) {
      // Single post days: use evening time (best engagement)
      return [this.postTimes[2]];
    } else {
      // Double post days: morning and evening
      return [this.postTimes[0], this.postTimes[2]];
    }
  },

  // Total posts per week
  totalWeeklyPosts: 10,

  // Day names for reference
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};

// Generate a week's worth of post slots
export function generateWeeklySchedule(startDate = new Date()) {
  const posts = [];
  let postNumber = 0;

  // Start from the beginning of the week (Sunday)
  const weekStart = new Date(startDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  for (let day = 0; day < 7; day++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + day);

    const times = schedule.getTimesForDay(day);

    for (const time of times) {
      const postDate = new Date(date);
      postDate.setHours(time.hour, time.minute, 0, 0);

      posts.push({
        postNumber: postNumber++,
        dayOfWeek: day,
        dayName: schedule.dayNames[day],
        date: postDate.toISOString().split('T')[0],
        time: time.label,
        postTime: `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
      });
    }
  }

  return posts;
}

// Get post slots for today
export function getTodaysPosts() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  return schedule.getTimesForDay(dayOfWeek).map((time, index) => ({
    dayOfWeek,
    dayName: schedule.dayNames[dayOfWeek],
    time: time.label,
    postTime: `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`,
    postIndex: index
  }));
}

export default schedule;
