try {
  console.log(crypto.randomUUID());
} catch(e) {
  console.error("ERROR:", e.name, e.message);
}
