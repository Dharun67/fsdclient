const API_URL = 'https://chainflowbackend.onrender.com/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('cf_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Orders API
export const ordersAPI = {
  getAll: async (search = '', status = 'all') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== 'all') params.append('status', status);
    
    const response = await fetch(`${API_URL}/orders?${params}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete order');
    return response.json();
  }
};

// Shipments API
export const shipmentsAPI = {
  getAll: async (search = '', status = 'all') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== 'all') params.append('status', status);
    
    const response = await fetch(`${API_URL}/shipments?${params}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch shipments');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch shipment');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/shipments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create shipment');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update shipment');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/shipments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete shipment');
    return response.json();
  }
};

// Inventory API
export const inventoryAPI = {
  getAll: async (search = '', status = 'all') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== 'all') params.append('status', status);
    
    const response = await fetch(`${API_URL}/inventory?${params}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch inventory');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create inventory item');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update inventory item');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete inventory item');
    return response.json();
  }
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async () => {
    const response = await fetch(`${API_URL}/dashboard/summary`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard summary');
    return response.json();
  },

  getChart: async () => {
    const response = await fetch(`${API_URL}/dashboard/chart`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch chart data');
    return response.json();
  },

  getNotifications: async () => {
    const response = await fetch(`${API_URL}/dashboard/notifications`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return response.json();
  },

  getActivity: async () => {
    const response = await fetch(`${API_URL}/dashboard/activity`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch activity');
    return response.json();
  },

  markNotificationRead: async (id: string) => {
    const response = await fetch(`${API_URL}/dashboard/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark notification as read');
    return response.json();
  },

  markAllNotificationsRead: async () => {
    const response = await fetch(`${API_URL}/dashboard/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to mark all notifications as read');
    return response.json();
  }
};

// Products API
export const productsAPI = {
  getAll: async (search = '', category = 'all', status = 'all') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category !== 'all') params.append('category', category);
    if (status !== 'all') params.append('status', status);
    
    const response = await fetch(`${API_URL}/products?${params}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  }
};

// Suppliers API
export const suppliersAPI = {
  getAll: async (search = '', status = 'all') => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status !== 'all') params.append('status', status);
    
    const response = await fetch(`${API_URL}/suppliers?${params}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch suppliers');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/suppliers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create supplier');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/suppliers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update supplier');
    return response.json();
  }
};

// Trucks API
export const trucksAPI = {
  getAll: async (status = 'all') => {
    const params = new URLSearchParams();
    if (status !== 'all') params.append('status', status);
    
    const response = await fetch(`${API_URL}/trucks?${params}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch trucks');
    return response.json();
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/trucks/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch truck');
    return response.json();
  },

  create: async (data: any) => {
    const response = await fetch(`${API_URL}/trucks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create truck');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_URL}/trucks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update truck');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/trucks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete truck');
    return response.json();
  }
};
