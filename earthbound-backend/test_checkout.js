const fetch = require("node-fetch");
async function test() {
  try {
    const rRes = await fetch("http://localhost:3100/api/auth/register", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({username:"testuser", email:"test@test.com", password:"password"})
    });
    const lRes = await fetch("http://localhost:3100/api/auth/login", {
      method: "POST", headers: {"Content-Type":"application/json"},
      body: JSON.stringify({email:"test@test.com", password:"password"})
    });
    const { token } = await lRes.json();
    console.log("Token:", token);
    const orderRes = await fetch("http://localhost:3100/api/orders", {
      method: "POST", headers: {"Content-Type":"application/json", "Authorization": "Bearer " + token},
      body: JSON.stringify({
        total_price: 50,
        items: [{product_id: 1, quantity: 1, price: 50}],
        shipping_address: "123 test", customer_name: "Test User"
      })
    });
    console.log("Order Res:", await orderRes.json());
  } catch(e) { console.error(e); }
}
test();
