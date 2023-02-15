const bcrypt = require('bcrypt');

const bcryptPass = async () => {
  const salt = await bcrypt.genSalt(10);

  const hashed = await bcrypt.hash('123456', salt);

  console.log(salt);
  console.log(hashed);
};

bcryptPass();
