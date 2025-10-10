using System.Linq.Expressions;
using TurnoPOS.Data.Models.Base;
using Microsoft.EntityFrameworkCore;

namespace TurnoPOS.Data.Repositories;

public class GenericRepository(TurnoDbContext context) : IGenericRepository
{

    public IQueryable<TEntity> Query<TEntity>() where TEntity : BaseEntity => context.Set<TEntity>();
    public IQueryable<TEntity> Get<TEntity>(
        Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        int? page = null,
        int? pageSize = null,
        params string[] includeProperties
    ) where TEntity : BaseEntity
    {
        IQueryable<TEntity> query = context.Set<TEntity>();

        if (filter != null)
        {
            query = query.Where(filter);
        }
        if (orderBy != null)
        {
            query = orderBy(query);
        }
        if (page.HasValue && pageSize.HasValue)
        {
            query = query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value);
        }

        query = includeProperties
            .Aggregate(query, (current, includeProperty) => current.Include(includeProperty));

        return query;
    }

    public IQueryable<TEntity> Get<TEntity>(
        Expression<Func<TEntity, bool>>? filter = null,
        params string[] includeProperties
    ) where TEntity : BaseEntity
    {
        IQueryable<TEntity> query = context.Set<TEntity>();
        if (filter != null)
        {
            query = query.Where(filter);
        }
        query = includeProperties.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));
        return query;
    }

    public ValueTask<TEntity?> GetById<TEntity>(long id) where TEntity : BaseEntity
        => context.Set<TEntity>().FindAsync(id);

    public TEntity Insert<TEntity>(TEntity entity) where TEntity : BaseEntity
    {
        context.Set<TEntity>().Add(entity);
        return entity;
    }

    public void Delete<TEntity>(long id) where TEntity : BaseEntity
    {
        var entityToDelete = context.Set<TEntity>().Find(id)!;
        Delete(entityToDelete);
    }

    public void Delete<TEntity>(TEntity entityToDelete) where TEntity : BaseEntity
    {
        if (context.Entry(entityToDelete).State == EntityState.Detached)
        {
            context.Set<TEntity>().Attach(entityToDelete);
        }
        context.Set<TEntity>().Remove(entityToDelete);
    }

    public void Update<TEntity>(TEntity entityToUpdate) where TEntity : BaseEntity
    {
        context.Set<TEntity>().Attach(entityToUpdate);
        context.Entry(entityToUpdate).State = EntityState.Modified;
    }

    public Task<int> SaveAsync()
        => context.SaveChangesAsync();

    public async Task<int> CountAsync<TEntity>(IQueryable<TEntity> query)
        where TEntity : BaseEntity
    {
        return await query.CountAsync();
    }

    public async Task<TEntity?> FirstOrDefault<TEntity>(IQueryable<TEntity> query)
        where TEntity : BaseEntity
    {
        return await query.FirstOrDefaultAsync();
    }

    public async Task<List<TEntity>> ToList<TEntity>(IQueryable<TEntity> query)
    {
        return await query.ToListAsync();
    }

    public async Task<bool> AnyAsync<TEntity>(IQueryable<TEntity> query, Expression<Func<TEntity, bool>> expression)
        where TEntity : BaseEntity
    {
        return await query.AnyAsync(expression);
    }

    public void Dispose()
    {
        context.Dispose();
    }
}