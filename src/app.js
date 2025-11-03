import {DayPilot} from "@daypilot/daypilot-lite-javascript";

const app = {
  scheduler: new DayPilot.Scheduler("dp", {
    timeHeaders: [{ groupBy: "Month" }, { groupBy: "Day", format: "d" }],
    scale: "Day",
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    days: DayPilot.Date.today().daysInMonth(),

    onTimeRangeSelected: async (args) => {
      const data = {
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        resource: args.resource,
        text: "Reservation"
      };

      const modal = await DayPilot.Modal.form(app.reservationForm, data);

      app.scheduler.clearSelection();

      if (modal.canceled) {
        return;
      }

      app.scheduler.events.add(modal.result);
    },

    onEventClick: (args) => {
      app.editEvent(args.e);
    },

    eventBorderRadius: 2,
    durationBarVisible: false,
    eventHeight: 40,
    cellWidth: 40,

    onBeforeEventRender: (args) => {
      args.data.html = "";
      args.data.resizeDisabled = true;

      const color = args.data.tags?.color;
      args.data.backColor = color || "#c0c0c0";
      args.data.borderColor = "darker";

      args.data.areas = [
        {
          left: 10,
          top: 0,
          bottom: 0,
          right: 0,
          text: args.data.text,
          cssClass: "reservation-text",
          verticalAlignment: "center"
        },
        {
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          action: "ResizeStart"
        },
        {
          right: 0,
          top: 0,
          bottom: 0,
          width: 10,
          action: "ResizeEnd"
        }
      ];
    }
  }),

  colors: [
    { name: "(default)", id: null },
    { name: "Blue",    id: "#6fa8dc" },
    { name: "Green",   id: "#93c47d" },
    { name: "Yellow",  id: "#ffd966" },
    { name: "Red",     id: "#f6b26b" }
  ],

  get reservationForm() {
    return [
      { name: "Text", id: "text" },
      { name: "Start", id: "start", type: "date" },
      { name: "End", id: "end", type: "date" },
      {
        name: "Room",
        id: "resource",
        type: "select",
        options: this.scheduler.resources
      },
      {
        name: "Color",
        id: "tags.color",
        type: "select",
        options: this.colors
      }
    ];
  },

  async editEvent(e) {
    const scheduler = this.scheduler;
    const form = this.reservationForm;
    const modal = await DayPilot.Modal.form(form, e.data);

    if (!modal.canceled) {
      scheduler.events.update(modal.result);
    }
  },

  init() {
    this.scheduler.init();

    const first = DayPilot.Date.today().firstDayOfMonth();

    const events = [
      {
        id: 1,
        start: first.addDays(1),
        end: first.addDays(8),
        text: "Reservation 1",
        resource: "R1",
        tags: {
          color: "#93c47d"
        }
      },
      {
        id: 2,
        start: first.addDays(8),
        end: first.addDays(12),
        text: "Reservation 2",
        resource: "R1",
        tags: {
          color: "#ffd966"
        }
      },
      {
        id: 3,
        start: first.addDays(3),
        end: first.addDays(9),
        text: "Reservation 3",
        resource: "R2",
        tags: {
          color: "#f6b26b"
        }
      },
      {
        id: 4,
        start: first.addDays(2),
        end: first.addDays(6),
        text: "Reservation 3",
        resource: "R4",
        tags: {
          color: "#6fa8dc"
        }
      },
    ];

    const resources = [
      { name: "Room 1", id: "R1" },
      { name: "Room 2", id: "R2" },
      { name: "Room 3", id: "R3" },
      { name: "Room 4", id: "R4" },
      { name: "Room 5", id: "R5" },
      { name: "Room 6", id: "R6" },
      { name: "Room 7", id: "R7" },
      { name: "Room 8", id: "R8" },
      { name: "Room 9", id: "R9" }
    ];

    this.scheduler.update({ resources, events });
  }
};

app.init();
