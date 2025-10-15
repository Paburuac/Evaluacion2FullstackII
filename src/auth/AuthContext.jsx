import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export const BRAND_COLOR = "#744f36";

const LS_KEYS = {
  USERS: "users",
  PRODUCTS: "products",
  SALES: "sales",
  CURRENT: "currentUser",
  INGREDIENTS: "ingredientsStock",
};

// Usuarios permanentes
const SEEDED_USERS = [
  {
    id: "admin-1",
    nombre: "Admin",
    apellido: "System",
    username: "ADMIN",
    password: "Futaba123",
    role: "ADMIN",
    createdAt: Date.now(),
  },
  {
    id: "staff-1",
    nombre: "Staff",
    apellido: "Worker",
    username: "STAFF",
    password: "joker123",
    role: "STAFF",
    createdAt: Date.now(),
  },
];

// Catálogo base
const SEEDED_PRODUCTS_SOURCE = [
  {
    name: "Café LeBlanc Original",
    price: 2490,
    description: "Blend especial de la casa, tueste medio.",
    image: "src/imagenes/imagen1.png",
  },
  {
    name: "Curry LeBlanc Original",
    price: 5990,
    description: "Receta secreta, servido con arroz japonés.",
    image: "src/imagenes/imagen2.jpg",
  },
  {
    name: "Cheesecake Persona",
    price: 4990,
    description: "Cheesecake japonés con frutos rojos.",
    image: "src/imagenes/imagen3.jpg",
  },
  {
    name: "Katsu Sando",
    price: 4990,
    description:
      "Sándwich japonés con chuleta de cerdo empanizada, col rallada y salsa tonkatsu.",
    image: "src/imagenes/imagen4.jpg",
  },
  {
    name: "Desayuno Japonés",
    price: 3990,
    description: "Arroz, huevo, nori y miso.",
    image: "src/imagenes/imagen5.png",
  },
  {
    name: `"Joker's Wild" Cocktail`,
    price: 3490,
    description: "Mocktail de granada, ginger ale y lima.",
    image: "src/imagenes/imagen6.png",
  },
];

// Ingredientes base (stock de cocina, independiente al de productos listos)
const SEEDED_INGREDIENTS = [
  { id: "ing-1", nombre: "Pan de molde", stock: 50 },
  { id: "ing-2", nombre: "Chuleta de cerdo", stock: 30 },
  { id: "ing-3", nombre: "Col rallada", stock: 20 },
  { id: "ing-4", nombre: "Salsa tonkatsu", stock: 10 },
  { id: "ing-5", nombre: "Arroz", stock: 100 },
  { id: "ing-6", nombre: "Huevos", stock: 60 },
  { id: "ing-7", nombre: "Nori (alga seca)", stock: 30 },
];

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  // Siembra inicial
  useEffect(() => {
    // Usuarios
    const users = readLS(LS_KEYS.USERS, []);
    const usernames = users.map((u) => u.username);
    const merged = [...users];
    for (const base of SEEDED_USERS) {
      if (!usernames.includes(base.username)) merged.push(base);
    }
    writeLS(LS_KEYS.USERS, merged);

    // Productos
    const products = readLS(LS_KEYS.PRODUCTS, []);
    if (products.length === 0) {
      const seeded = SEEDED_PRODUCTS_SOURCE.map((p) => ({
        id: crypto.randomUUID(),
        nombre: p.name,
        precio: p.price,
        stock: 20,
        description: p.description,
        image: p.image,
        isDeleted: false,
        removedAt: null,
        createdAt: Date.now(),
      }));
      writeLS(LS_KEYS.PRODUCTS, seeded);
    }

    // Ingredientes
    const ingredients = readLS(LS_KEYS.INGREDIENTS, []);
    if (ingredients.length === 0) writeLS(LS_KEYS.INGREDIENTS, SEEDED_INGREDIENTS);

    // Ventas
    if (!localStorage.getItem(LS_KEYS.SALES)) writeLS(LS_KEYS.SALES, []);
  }, []);

  const [currentUser, setCurrentUser] = useState(() =>
    readLS(LS_KEYS.CURRENT, null)
  );

  // ========= AUTH =========
  const login = async ({ username, password }) => {
    const users = readLS(LS_KEYS.USERS, []);
    const found = users.find(
      (u) =>
        u.username.trim().toLowerCase() === username.trim().toLowerCase() &&
        u.password === password
    );
    if (!found) throw new Error("Usuario o contraseña incorrectos");
    setCurrentUser(found);
    writeLS(LS_KEYS.CURRENT, found);
    return found;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LS_KEYS.CURRENT);
  };

  const register = async ({ nombre, apellido, username, password, role = "USER" }) => {
    const users = readLS(LS_KEYS.USERS, []);
    if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error("El nombre de usuario ya existe");
    }
    const newUser = {
      id: crypto.randomUUID(),
      nombre,
      apellido,
      username,
      password,
      role,
      createdAt: Date.now(),
    };
    writeLS(LS_KEYS.USERS, [newUser, ...users]);
    return newUser;
  };

  const listUsers = () => readLS(LS_KEYS.USERS, []);
  const updateUser = (id, patch) => {
    const users = readLS(LS_KEYS.USERS, []);
    const updated = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    writeLS(LS_KEYS.USERS, updated);
    if (currentUser?.id === id) {
      const fresh = updated.find((u) => u.id === id);
      setCurrentUser(fresh);
      writeLS(LS_KEYS.CURRENT, fresh);
    }
  };
  const removeUser = (id) => {
    if (id === "admin-1" || id === "staff-1")
      throw new Error("No se puede eliminar este usuario permanente");
    const users = readLS(LS_KEYS.USERS, []);
    writeLS(LS_KEYS.USERS, users.filter((u) => u.id !== id));
  };

  // ========= PRODUCTS (incluye retirados y reset) =========
  const _readAllProducts = () => readLS(LS_KEYS.PRODUCTS, []);
  const _writeProducts = (arr) => writeLS(LS_KEYS.PRODUCTS, arr);

  const listProducts = () => _readAllProducts().filter((p) => !p.isDeleted);
  const listRemovedProducts = () => _readAllProducts().filter((p) => p.isDeleted);

  const addProduct = (prod) => {
    const products = _readAllProducts();
    const newP = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      isDeleted: false,
      removedAt: null,
      ...prod,
    };
    _writeProducts([newP, ...products]);
    return newP;
  };

  const updateProduct = (id, patch) => {
    const products = _readAllProducts();
    _writeProducts(products.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const removeProduct = (id) => {
    const products = _readAllProducts();
    _writeProducts(
      products.map((p) =>
        p.id === id ? { ...p, isDeleted: true, removedAt: Date.now() } : p
      )
    );
  };

  const restoreProduct = (id) => {
    const products = _readAllProducts();
    _writeProducts(
      products.map((p) =>
        p.id === id ? { ...p, isDeleted: false, removedAt: null } : p
      )
    );
  };

  const resetProductsToSeed = () => {
    const seeded = SEEDED_PRODUCTS_SOURCE.map((p) => ({
      id: crypto.randomUUID(),
      nombre: p.name,
      precio: p.price,
      stock: 20,
      description: p.description,
      image: p.image,
      createdAt: Date.now(),
      isDeleted: false,
      removedAt: null,
    }));
    _writeProducts(seeded);
  };

  // ========= INGREDIENTS (stock de cocina) =========
  const listIngredients = () => readLS(LS_KEYS.INGREDIENTS, []);
  const updateIngredient = (id, patch) => {
    const ingredients = readLS(LS_KEYS.INGREDIENTS, []);
    writeLS(
      LS_KEYS.INGREDIENTS,
      ingredients.map((i) => (i.id === id ? { ...i, ...patch } : i))
    );
  };
  const orderMoreIngredient = (id, amount = 10) => {
    const ingredients = readLS(LS_KEYS.INGREDIENTS, []);
    writeLS(
      LS_KEYS.INGREDIENTS,
      ingredients.map((i) =>
        i.id === id ? { ...i, stock: Number(i.stock || 0) + amount } : i
      )
    );
  };

  // ========= SALES (con medio de pago) =========
  const listSales = () => readLS(LS_KEYS.SALES, []);
  const recordSale = ({ productId, qty = 1, amount = 0, pago = "Efectivo" }) => {
    const sales = readLS(LS_KEYS.SALES, []);
    const newSale = {
      id: crypto.randomUUID(),
      productId,
      qty,
      amount,
      pago, // "Efectivo" | "Tarjeta"
      registradoPor: currentUser?.username || "STAFF",
      createdAt: Date.now(),
    };
    writeLS(LS_KEYS.SALES, [newSale, ...sales]);
    return newSale;
  };

  const getMonthlySummary = () => {
    const since = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const sales = listSales().filter((s) => s.createdAt >= since);
    const totalVentas = sales.length;
    const totalUnidades = sales.reduce((a, s) => a + (s.qty || 0), 0);
    const totalMonto = sales.reduce((a, s) => a + (s.amount || 0), 0);
    return { totalVentas, totalUnidades, totalMonto, desde: new Date(since) };
  };

  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
      register,
      // users
      listUsers,
      updateUser,
      removeUser,
      // products
      listProducts,
      listRemovedProducts,
      addProduct,
      updateProduct,
      removeProduct,
      restoreProduct,
      resetProductsToSeed,
      // ingredients
      listIngredients,
      updateIngredient,
      orderMoreIngredient,
      // sales
      listSales,
      recordSale,
      getMonthlySummary,
      // theme
      BRAND_COLOR,
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
