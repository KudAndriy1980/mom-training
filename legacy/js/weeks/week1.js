// Week 1 — щадний старт. Базові вправи, мало повторів.
// Вправи згруповані за позою: лежачи → сидячи → стоячи,
// щоб мамі не доводилося часто вставати/лягати.

registerWeek({
  id: "week1",
  label: "Тиждень 1",
  description: "Щадний старт",
  dayProfiles: {
    d12: { label: "Дні 1–2", sub: "Утримання 15 сек, 5 повторів", holdElbow: 15, reps: 5,  holdGlute: 3, repsStand: 3 },
    d34: { label: "Дні 3–4", sub: "Утримання 20 сек, 7 повторів", holdElbow: 20, reps: 7,  holdGlute: 5, repsStand: 3 },
    d57: { label: "Дні 5–7", sub: "Утримання 30 сек, 10 повторів", holdElbow: 30, reps: 10, holdGlute: 5, repsStand: 5 },
  },
  dayOrder: ["d12", "d34", "d57"],

  buildExercises(p) {
    return [
      // ─── 🛌 Лежачи ───
      {
        block: "Підготовка", emoji: "🔥", position: "lying",
        title: "Тепло на ліктях",
        desc: "Грілка або теплий рушник на обидва лікті. Лежачи на спині, розслабитися.",
        kind: "timer", duration: 10 * 60,
        hint: "Можна закрити очі й просто побути в тиші.",
      },
      {
        block: "Дихання", emoji: "🫁", position: "lying",
        title: "Діафрагмальне дихання",
        desc: "Рука на животі. Глибокий вдих носом (живіт піднімається), повільний видих ротом.",
        kind: "reps", repsTarget: 5, repsLabel: "вдихів",
      },
      {
        block: "Лікті", emoji: "💪", position: "lying",
        title: "Позиційне розтягнення",
        desc: "Лежачи на спині, руки вздовж тіла долонями догори. Просто лежати.",
        kind: "timer", duration: 5 * 60,
        hint: "Можна подовжити до 10 хв — це і відпочинок теж.",
      },
      {
        block: "Ноги і корпус", emoji: "🦵", position: "lying",
        title: "Стискання сідниць",
        desc: "Лежачи — напружити сідничні м'язи, утримати, розслабити.",
        kind: "holdReps", repsTarget: 10, hold: p.holdGlute,
      },

      // ─── 🪑 Сидячи ───
      {
        block: "Лікті", emoji: "💪", position: "sitting",
        title: "Пасивне розгинання",
        desc: "Сидячи, рука на столі долонею догори. Помічник плавно випрямляє передпліччя до натягу.",
        kind: "holdReps", sides: true, repsTarget: 4, hold: p.holdElbow,
        hint: "Тільки до відчуття натягу — НЕ до болю.",
      },
      {
        block: "Лікті", emoji: "💪", position: "sitting",
        title: "Активне згинання-розгинання",
        desc: "Сидячи, рука на столі. Плавно згинати й розгинати лікоть.",
        kind: "reps", sides: true, repsTarget: 8, repsLabel: "повторів",
      },
      {
        block: "Кисті й пальці", emoji: "✋", position: "sitting",
        title: "М'який м'ячик або губка",
        desc: "Стискати м'ячик, утримувати 3 секунди, відпускати.",
        kind: "holdReps", sides: true, repsTarget: 10, hold: 3,
      },
      {
        block: "Кисті й пальці", emoji: "✋", position: "sitting",
        title: "Дотики пальцями",
        desc: "Великий палець по черзі торкається до вказівного → середнього → безіменного → мізинця.",
        kind: "reps", sides: true, repsTarget: 5, repsLabel: "циклів",
      },
      {
        block: "Кисті й пальці", emoji: "✋", position: "sitting",
        title: "Розведення пальців",
        desc: "Долоня на столі. Максимально розвести пальці, утримати 3 сек, зібрати.",
        kind: "holdReps", repsTarget: 8, hold: 3,
      },
      {
        block: "Кисті й пальці", emoji: "✋", position: "sitting",
        title: "«Павучок» по столу",
        desc: "Пальці «крокують» кінчиками по столу.",
        kind: "timer", sides: true, duration: 30,
      },
      {
        block: "Плечі", emoji: "🧍", position: "sitting",
        title: "Руки в замку догори",
        desc: "Сидячи, пальці в замок перед собою. Повільно підняти руки догори наскільки виходить, опустити.",
        kind: "reps", repsTarget: 5, repsLabel: "повторів",
      },
      {
        block: "Ноги і корпус", emoji: "🦵", position: "sitting",
        title: "Марширування сидячи",
        desc: "По черзі піднімати коліна, не поспішаючи.",
        kind: "reps", sides: true, repsTarget: 8, repsLabel: "разів",
        sideLabels: ["Ліва нога", "Права нога"],
      },
      {
        block: "Ноги і корпус", emoji: "🦵", position: "sitting",
        title: "Вставання зі стільця",
        desc: "Стілець з підлокітниками. Нахил вперед, відштовхнутися руками, встати, сісти.",
        kind: "reps", repsTarget: p.repsStand, repsLabel: "повторів",
        hint: "На останньому повторі — залишитися стоячи для наступних вправ.",
      },

      // ─── 🧍 Стоячи ───
      {
        block: "Плечі", emoji: "🧍", position: "standing",
        title: "«Маятник» — гойдання",
        desc: "Нахилитися вперед, здорова рука на опорі, слабка вільно звисає. Погойдувати вперед-назад.",
        kind: "timer", duration: 30,
      },
      {
        block: "Плечі", emoji: "🧍", position: "standing",
        title: "«Маятник» — кола",
        desc: "У тій самій позиції — вільна рука описує кола.",
        kind: "timer", duration: 30,
      },
    ];
  },
});
