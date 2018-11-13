export const conversationParam = (uid1, uid2) => {
  if (uid1 < uid2) {
    return `${uid1}-${uid2}`;
  } else {
    return `${uid2}-${uid1}`;
  }
};

export const sortByAlphabet = (a, b) => {
  if (a.lastName < b.lastName) {
    return -1;
  } else if (a.lastName > b.lastName) {
    return 1;
  } else {
    if (a.firstName < b.firstName) {
      return -1;
    } else if (a.firstName > b.firstName) {
      return 1;
    }
  }
  return 0;
};

export const sortByLastestChat = (uid, conversation, users, status) => {
  let usersResult = [];
  let statusResult = [];
  let tempUsers = [...users];
  if (conversation) {
    users.map((user, index) => {
      const data = conversation.find(item => item.id === user.id);
      if (data || uid === user.id) {
        tempUsers.splice(index, 1, null);
      }
      return null;
    });
    const tempCvst = conversation.map(item => {
      const data = users.find(user => user.id === item.id);
      if (!data) {
        return null;
      }
      return data;
    });
    tempCvst.forEach(element => {
      if (element) {
        usersResult.push(element);
        const data = status.find(item => item.id === element.id);
        statusResult.push(data);
      }
    });
  }
  tempUsers.forEach(element => {
    if (element) {
      usersResult.push(element);
      const data = status.find(item => item.id === element.id);
      statusResult.push(data);
    }
  });
  return {
    users: usersResult,
    status: statusResult
  };
};

export const sortByStar = (star, users, status) => {
  let result = []
  let usersResult = []
  let statusResult = [];
  let tempUsers = [...users];
  if (star) {
    star.forEach(element => {
      const isUndefined = status.length !== 0 && status.find(item => item === undefined)
      const data = isUndefined ? status.find(item => item.id === element.id) : null;
      if (data) {
        if (data.state === 'online') {
          result.push(data)
        }
      }
    })
  }
  if (result.length !== 0) {
    users.map((user, index) => {
      const data = result.find(item => item.id === user.id);
      if (data) {
        usersResult.push(user)
        tempUsers.splice(index, 1, null);
        statusResult.push(status[index])
      }
      return null
    });
    tempUsers.map((user, index) => {
      if (user) {
        usersResult.push(user)
        tempUsers.splice(index, 1, null);
        statusResult.push(status[index])
      }
      return null
    });
  }
  return {
    users: usersResult.length !== 0 ? usersResult : users,
    status: statusResult.length !== 0 ? statusResult : status
  };
}