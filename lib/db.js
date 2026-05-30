import { supabaseAdmin } from './supabase';

class SupabaseCollectionMock {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async find(query = {}) {
    return {
      sort: (sortSpec = {}) => {
        return {
          limit: (limitNum) => {
            return {
              toArray: async () => {
                let q = supabaseAdmin.from(this.tableName).select('*');
                // Apply sorting
                const sortKeys = Object.keys(sortSpec);
                if (sortKeys.length > 0) {
                  const key = sortKeys[0];
                  const ascending = sortSpec[key] === 1;
                  q = q.order(key, { ascending });
                }
                // Apply limit
                if (limitNum) {
                  q = q.limit(limitNum);
                }
                const { data, error } = await q;
                if (error) throw error;
                return data || [];
              }
            };
          },
          toArray: async () => {
            let q = supabaseAdmin.from(this.tableName).select('*');
            const sortKeys = Object.keys(sortSpec);
            if (sortKeys.length > 0) {
              const key = sortKeys[0];
              const ascending = sortSpec[key] === 1;
              q = q.order(key, { ascending });
            }
            const { data, error } = await q;
            if (error) throw error;
            return data || [];
          }
        };
      },
      toArray: async () => {
        const { data, error } = await supabaseAdmin.from(this.tableName).select('*');
        if (error) throw error;
        return data || [];
      }
    };
  }

  async findOne(query = {}) {
    let q = supabaseAdmin.from(this.tableName).select('*');
    const keys = Object.keys(query);
    keys.forEach(k => {
      q = q.eq(k, query[k]);
    });
    const { data, error } = await q.maybeSingle();
    if (error) throw error;
    return data;
  }

  async insertOne(doc) {
    const { data, error } = await supabaseAdmin.from(this.tableName).insert([doc]).select();
    if (error) throw error;
    return { insertedId: doc.id || (data && data[0] ? data[0].id : null), acknowledged: true };
  }

  async updateOne(filter, update, options = {}) {
    const keys = Object.keys(filter);
    const setObj = update.$set || update;
    let q = supabaseAdmin.from(this.tableName).update(setObj);
    keys.forEach(k => {
      q = q.eq(k, filter[k]);
    });
    const { data, error } = await q.select();
    if (error) {
      if (options.upsert) {
        const upsertDoc = { ...filter, ...setObj };
        const { error: upsertErr } = await supabaseAdmin.from(this.tableName).upsert(upsertDoc);
        if (upsertErr) throw upsertErr;
        return { matchedCount: 1, modifiedCount: 1, acknowledged: true };
      }
      throw error;
    }
    return { matchedCount: data && data.length > 0 ? 1 : 0, modifiedCount: data && data.length > 0 ? 1 : 0, acknowledged: true };
  }

  async deleteOne(filter) {
    const keys = Object.keys(filter);
    let q = supabaseAdmin.from(this.tableName).delete();
    keys.forEach(k => {
      q = q.eq(k, filter[k]);
    });
    const { data, error } = await q.select();
    if (error) throw error;
    return { deletedCount: data && data.length > 0 ? 1 : 0, acknowledged: true };
  }

  async countDocuments(filter = {}) {
    const keys = Object.keys(filter);
    let q = supabaseAdmin.from(this.tableName).select('*', { count: 'exact', head: true });
    keys.forEach(k => {
      q = q.eq(k, filter[k]);
    });
    const { count, error } = await q;
    if (error) throw error;
    return count || 0;
  }
}

class SupabaseDbMock {
  collection(name) {
    return new SupabaseCollectionMock(name);
  }
}

export async function connectToDatabase() {
  return {
    client: {},
    db: new SupabaseDbMock()
  };
}
