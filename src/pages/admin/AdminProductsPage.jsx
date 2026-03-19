function AdminProductsPage() {
  const products = [
    {
      id: 1,
      name: "PC Portable Pro 15",
      category: "Ordinateurs",
      stock: 8,
      price: "999,99 €",
    },
    {
      id: 2,
      name: "Smartphone X",
      category: "Smartphones",
      stock: 15,
      price: "699,99 €",
    },
    {
      id: 3,
      name: "Casque Audio",
      category: "Accessoires",
      stock: 20,
      price: "129,99 €",
    },
  ];

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Admin Produits</h1>
            <p>Préparation du futur CRUD produits.</p>
          </div>

          <button className="btn btn-primary" disabled>
            Nouveau produit
          </button>
        </div>

        <div className="box table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produit</th>
                <th>Catégorie</th>
                <th>Stock</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>{product.price}</td>
                  <td>
                    <div className="admin-actions">
                      <button className="btn btn-secondary" disabled>
                        Modifier
                      </button>
                      <button className="btn btn-secondary" disabled>
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminProductsPage;