import { type HydratedDocument, type Model, type ObjectId, type Query, type UpdateQuery } from 'mongoose';
import { AbstractRecordStore } from './abstract-record-store';

interface Item {
    id: string;
}

export abstract class AbstractRecordDocStore<T extends Item = any> extends AbstractRecordStore<HydratedDocument<T>> {

	Schema: Model<T>;

	constructor(schema: Model<any>, id?: `${string}-cache`) {
		super(id);
		this.Schema = schema;
	}

	protected populated(query: Query<any, any>, args: string[]): Query<any, T> {
		args.forEach(arg => query.populate(arg));
		return query;
	}

	private async createDoc(value: T): Promise<HydratedDocument<T>> {
		const doc = new this.Schema(value);
		return await doc.save() as any;
	}

	private async getOrCreateDoc(search: object, value: T, args: string[] = []): Promise<HydratedDocument<T>> {
		let doc = await this.searchDoc(search, args);
		if (!doc) {
			doc = await this.createDoc(value);
		}
		return doc;
	}

	private async searchDoc(search: object, args: string[] = []): Promise<HydratedDocument<T> | null> {
		const query = this.Schema
			.findOne(search);
		return await this.populated(query, args).exec();
	}

	private async getDoc(_id: ObjectId, args: string[] = []): Promise<HydratedDocument<T> | null> {
		const query = this.Schema
			.findOne({ _id });
		return await this.populated(query, args).exec();
	}

	private async getDocs(search: object, args: string[] = []): Promise<Array<HydratedDocument<T>>> {
		const query = this.Schema
			.find(search);
		return await this.populated(query, args).exec();
	}

	private async updateDoc(_id: ObjectId, value: UpdateQuery<T> | Partial<T>, args: string[] = []): Promise<HydratedDocument<T> | null> {
		const query = this.Schema.findOneAndUpdate(
			{ _id },
			{
				...value,
			},
			{ new: true },
		);
		return await this.populated(query, args).exec();
	}

	private async removeDoc(_id: ObjectId): Promise<void> {
		await this.Schema.deleteOne({ _id }).exec();
	}

	async addItem(value: T): Promise<T> {
		const doc = await this.createDoc(value);
		return await super.save(doc.id, doc).toObject();
	}

	async getOrAddItem(value: T, args: string[] = []): Promise<T> {
		let item = await this.getItem(value.id, args);
		if (!item) {
			item = await this.addItem(value);
		}
		return item;
	}

	async getItem(id: string, args: string[] = []): Promise<T | null> {
		const item = await this.getDocById(id, args);
		// TODO: hide __v & _id !
		// delete item?.__v;
		// delete (item  as any)?._id;
		return await (item?.toObject() ?? null);
	}

	async updateItem(id: string, value: UpdateQuery<T> | Partial<T>, args: string[] = []): Promise<T | null> {
		const item = await this.getDocById(id);
		if (!item) return null;
		const doc = await this.updateDoc(item._id as any, value, args);
		if (!doc) return null;
		return await (this.save(doc?.id, doc).toObject() ?? null);
	}

	async removeItem(id: string): Promise<HydratedDocument<T> | null> {
		const item = await this.getDocById(id);
		if (!item) return null;
		await this.removeDoc(item._id as any);
		this.remove(id);
		return item;
	}

	async update(id: string, value: Partial<T>): Promise<T | null> {
		return await this.updateItem(id, value, []);
	}

	async getDocById(id: string, args: string[] = []): Promise<HydratedDocument<T> | null> {
		let item = this.get(id);
		if (!item) {
			item = await this.searchDoc({ id }, args);
			if (item) this.save(id, item);
		}
		return item;
	}
}