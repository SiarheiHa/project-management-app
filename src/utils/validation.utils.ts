export const rules = {
  login: {
    required: 'form.errors.noLogin',
    minLength: {
      value: 3,
      message: 'form.errors.shortLogin',
    },
  },
  password: {
    required: 'form.errors.noPassword',
    minLength: {
      value: 3,
      message: 'form.errors.shortPassword',
    },
  },
  name: {
    required: 'form.errors.noName',
    minLength: {
      value: 3,
      message: 'form.errors.shortName',
    },
  },
  columnName: {
    required: 'form.errors.noTitle',
    minLength: {
      value: 3,
      message: 'form.errors.shortColumnName',
    },
    maxLength: {
      value: 16,
      message: 'form.errors.noMoreThan16Letters',
    },
  },
  columnDescription: {
    required: 'form.errors.noDescription',
    minLength: {
      value: 3,
      message: 'form.errors.shortDescription',
    },
    maxLength: {
      value: 50,
      message: 'form.errors.noMoreThen50Letters',
    },
  },
  taskTitle: {
    required: 'form.errors.noTitle',
    maxLength: {
      value: 18,
      message: 'form.errors.noMoreThan18Letters',
    },
  },
  taskDescription: {
    required: 'form.errors.noDescription',
  },
  boardInfo: {
    required: 'form.errors.noTitle',
  },
};
