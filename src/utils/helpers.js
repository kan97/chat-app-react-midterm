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
  const tempUsers = [...users];
  if (conversation) {
    users.map((user, index) => {
      var data = conversation.find(item => item.id === user.id);
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