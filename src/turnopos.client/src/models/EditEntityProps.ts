export default interface EditEntityProps<Entity> {
    entity: Entity;
    onSave?: (updatedItem: Entity) => void;
    onChanged?: (updatedItem: Entity) => void;
    onCancel?: (id: number) => void;
}